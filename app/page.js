"use client"
import { useState } from "react";
import { Button, Checkbox, Container, SimpleGrid, Box, TextInput, Title, Select } from "@mantine/core";

export default function Home() {

  const [url, setUrl] = useState('');
  const [noImage, setNoImage] = useState(true)
  const [draft, setDraft] = useState(false)
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [site, setSite] = useState("F")


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
      body: JSON.stringify({url, noImage, draft, site})
    });
    const data = await response.json();
    //output
    setOutput(data)
    console.log(data)
    setLoading(false)

  }
  return (
    <Container size="sm" pt="xl">

      <Title pt="xl" mb="lg">Scrape Amomama</Title>
      <TextInput placeholder="Enter the URL" value={url} onChange={(e) => setUrl(e.target.value)} />
      <Select data={[{value:"F", label:"ForeverLoveAnimals"}, {value:"A", label:"AnimalsTrend"}]} value={site} onChange={setSite} label="Select Site" />
      
      <SimpleGrid cols={2} gap="md" mt="lg">
        <Checkbox checked={noImage} onChange={(e) => setNoImage(e.currentTarget.checked)} label="No Image" />
        <Checkbox checked={draft} onChange={(e) => setDraft(e.currentTarget.checked)} label="Draft" />
      </SimpleGrid>

    <Box mt="lg" ta="center">
      <Button fullWidth onClick={submit} loading={loading} disabled={loading} variant="light" color="blue">
        {loading ? 'Loading...' : 'Submit'}
      </Button>
    </Box>
    {output && 
      <output><pre>{JSON.stringify(output, null, 2)}</pre></output>
    }
    </Container>

  );
}
