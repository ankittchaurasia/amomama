"use client"
import { useState } from "react";

export default function Home() {

  const [url, setUrl] = useState('');
  const [noImage, setNoImage] = useState(false)
  const [draft, setDraft] = useState(false)
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)


  const submit = async() => {
    if(url === ''){
      alert('Please enter a URL')
      return
    }
    setLoading(true)

    const response = await fetch('/api/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({url, noImage, draft})
    });
    const data = await response.json();
    //output
    setOutput(data)
    setLoading(false)

  }
  return (
    <main className="p-24">
      {/* input field and submit field */}

      <h1 className="text-4xl font-bold text-center">Scrape Amomama</h1>
      <div className="flex flex-col items-center justify-center">
        <input
          type="text"
          placeholder="Enter the URL"
          className="border border-gray-300 p-1 m-1 w-1/2"
          autoComplete="off"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <br />
      <div className="flex items-center">
        <input type="checkbox" id="noImage" className="w-5 h-5 p-1 m-1" name="noImage"  
          checked={noImage} onChange={(e) => setNoImage(e.target.checked)} 
        />
        <label htmlFor="noImage">No Image</label>
      </div>
      <div className="flex items-center">
        <input type="checkbox" id="draft" className="w-5 h-5 p-1 m-1" name="draft"  
          checked={draft} onChange={(e) => setDraft(e.target.checked)}
        />
        <label htmlFor="draft">Draft</label>
      </div>
        <button className="bg-blue-500 text-white px-3 py-1 m-2 rounded" onClick={submit} disabled={loading}>
        {loading ? (
          <div className="animate-spin">@</div>
        ) : (
          'Submit'
        )}
        </button>
      </div>
      <output><pre>{JSON.stringify(output, null, 2)}</pre></output>
    </main>


  );
}
