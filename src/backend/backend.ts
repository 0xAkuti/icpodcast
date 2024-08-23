import express from 'express';
import { Server, ic, query } from 'azle';

import {
    HttpResponse,
    HttpTransformArgs,
} from 'azle/canisters/management';



interface Episode {
    title: string;
    description: string;
    pubDate: string;
    category: string;
    audio: string;
}

interface Show {
    title: string;
    description: string;
    cover: string; // url to image, should we also upload that to icp?
    website: string;
    author: string;
    ownerName: string;
    ownerMail: string;
    keywords: string[];
    episodes: Episode[];
}

export default Server(
    // Server section
    () => {
        const app = express();
        app.use(express.json());

        let shows: { [showName: string]: Show } = {};


        // list available shows
        app.get('/list', (_req, res) => {
            res.json(Object.keys(shows));
        });

        // Route to get the cover image as a file
        app.get('/show/:title/cover', (req, res) => {
            const show = shows[req.params.title];

            if (!show) {
                res.status(404).json({ error: 'Show not found' });
                return;
            }

            const base64Data = show.cover.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');

            res.setHeader('Content-Type', 'image/png'); // Adjust the MIME type as needed
            res.send(buffer);
        });

        // Route to get the audio file as an MP3
        app.get('/show/:title/episode/:id/audio', (req, res) => {
            const show = shows[req.params.title];

            if (!show) {
                res.status(404).json({ error: 'Show not found' });
                return;
            }

            const episode = show.episodes[parseInt(req.params.id)];
            if (!episode) {
                res.status(404).json({ error: 'Episode not found' });
                return;
            }

            const base64Data = episode.audio.replace(/^data:audio\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');

            res.setHeader('Content-Type', 'audio/mpeg'); // Adjust the MIME type as needed
            res.send(buffer);
        });

        // get the RSS feed for a specific show
        app.get('/show/:title/feed', (req, res) => {
            const show = shows[req.params.title];
            if (!show) {
                res.status(404).json({ error: 'Show not found' });
                return;
            }

            const host = "https://" + req.headers.host;

            const rssFeed = `
                <rss version="2.0">
                    <channel>
                        <title>${show.title}</title>
                        <description>${show.description}</description>
                        <link>${show.website}</link>
                        <image>
                            <url>${host}/show/${show.title}/cover</url>
                            <title>${show.title}</title>
                            <link>${show.website}</link>
                        </image>
                        <author>${show.author}</author>
                        <itunes:owner>
                            <itunes:name>${show.ownerName}</itunes:name>
                            <itunes:email>${show.ownerMail}</itunes:email>
                        </itunes:owner>
                        <itunes:keywords>${show.keywords.join(',')}</itunes:keywords>
                        ${show.episodes.map((episode, index) => `
                            <item>
                                <title>${episode.title}</title>
                                <description>${episode.description}</description>
                                <link>${host}/show/${encodeURIComponent(show.title)}/episode/${index}/audio</link>
                                <pubDate>${episode.pubDate}</pubDate>
                                <category>${episode.category}</category>
                                <enclosure url="${host}/show/${encodeURIComponent(show.title)}/episode/${index}/audio" type="audio/mpeg" />
                            </item>
                        `).join('')}
                    </channel>
                </rss>
            `;

            res.set('Content-Type', 'application/rss+xml');
            res.send(rssFeed);
        });

        // Route to register a new show
        // Route to register a new show
        app.post('/add/show', (req, res) => {
            const { title, description, cover, website, author, ownerName, ownerMail } = req.body;

            if (!title || !description || !website || !author || !ownerName || !ownerMail) {
                res.status(400).json({ error: 'All show attributes are required' });
                return;
            }

            if (shows[title]) {
                res.status(400).json({ error: 'Show already exists' });
                return;
            }

            shows[title] = {
                title,
                description,
                cover,
                website,
                author,
                ownerName,
                ownerMail,
                keywords: [],
                episodes: []
            };

            res.json({ status: 'Ok' });
        });

        // Route to add an episode to a show
        app.post('/add/episode', (req, res) => {
            const { showName, title, description, pubDate, category, audio } = req.body;

            const show = shows[showName];
            if (!show) {
                res.status(404).json({ error: 'Show not found' });
                return;
            }

            const episode: Episode = {
                title,
                description,
                pubDate,
                category,
                audio
            };

            show.episodes.push(episode);
            res.json({ status: 'Ok' });
        });

        app.use(express.static('/dist'));
        return app.listen();
    },
    // Candid section
    {
        // The transformation function for the HTTP outcall responses.
        // Required to reach consensus among different results the nodes might get.
        // Only if they all get the same response, the result is returned, so make sure
        // your HTTP requests are idempotent and don't depend e.g. on the time.
        transform: query([HttpTransformArgs], HttpResponse, (args) => {
            return {
                ...args.response,
                headers: []
            };
        })
    }
);
