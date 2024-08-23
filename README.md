# ICPod

A decentralized podcast hosting platform on the Internet Computer, built by AI Fusion Labs (aifusionlabs.xyz) at Chain Fusion Hackerhouse, Bali (Aug22-23, 2024)


![ICPod](https://github.com/user-attachments/assets/cd9ef66d-dada-4e45-a9c9-f91c65370f74)



## Why decentralized podcast hosting?
Traditional podcast hosting often collects unnecessary metadata, compromising user privacy. In contrast, decentralized hosting ensures users retain 100% ownership of their data without sacrificing privacy. Additionally, decentralized podcast hosting protects against censorship by preventing authorities from taking down contents from the hosting platform.

## Methods
* Using Azle
* Single canister application
* REST API to register shows, upload episodes and generate Podcast RSS feed
* Express server

## Technical Details
Providing a REST API to generate RSS feed following the specifications for podcast feeds, to allow any podcasting application to subscribe to and use the podcasts hosted on ICP. The API also provides endpoints for adding new shows and episodes to existing shows. For uploading data currently base64 encoding is used, in the future we would change to using asset canisters and upload binary files directly to support larger files with streaming.


## How to Run
* Locally 
```bash
dfx start --clean # Start a local ICP node
# In a new terminal window:
dfx deploy # Deploy smart contract locally
```
* Live
https://v3ol7-yiaaa-aaaak-qivfq-cai.raw.icp0.io

## Routes
* GET `/list` lists all available Shows
* GET `/show/<title>/cover` get the Shows cover image
* GET `/show/<title>/feed` get the Shows podcasting feed
* GET `/show/<title>/<episode>/audio` get the episodes audio stream
* POST `/add/show` register a new show, the request should contain a json with the following info: title, description, cover, website, author, ownerName, ownerMail
* POST `/add/episode` register a new episode for an existing show, the request should contain a json with the following info: showName, title, description, pubDate, category, audio
