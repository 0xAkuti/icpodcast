import { useState } from 'react';
import { backend } from '../../declarations/backend';

export default function App() {
  const [formData, setFormData] = useState({
    podcastTitle: '',
    description: '',
    cover: null,
    website: '',
    author: '',
    ownerName: '',
    ownerEmail: '',
    keywords: ''
  });

  function handleInputChange(event: any) {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  function handleFileChange(event: any) {

  };

  async function handleSubmit(event: any) {
    event.preventDefault();

    try {
      //const result = await backend.addShow(formData);
      //console.log('Show created successfully:', result);
      // Handle success (e.g., show a success message, reset form, etc.)
    } catch (error) {
      console.error('Failed to create show:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <main>
      <h1>Let's add your first show!</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="podcastTitle">Podcast title:</label>
          <input
            type="text"
            id="podcastTitle"
            name="podcastTitle"
            value={formData.podcastTitle}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="cover">Cover:</label>
          <input
            type="file"
            id="cover"
            name="cover"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label htmlFor="website">Website:</label>
          <input
            type="text"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="ownerName">Owner name:</label>
          <input
            type="text"
            id="ownerName"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="ownerEmail">Owner email:</label>
          <input
            type="email"
            id="ownerEmail"
            name="ownerEmail"
            value={formData.ownerEmail}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="keywords">Keywords:</label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            value={formData.keywords}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Create Show</button>
      </form>
    </main>
  );
}