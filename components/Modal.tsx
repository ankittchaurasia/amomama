import { 
  Modal, Button, LoadingOverlay, TextInput, Tooltip, Textarea, Grid, Image as MantineImage, 
  Paper, FileInput, Text, CopyButton, SimpleGrid
} from '@mantine/core';

import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from '@mantine/hooks';
import NextLink from 'next/link';

interface ModalProps {
    link: string
    opened: boolean
    domain: string
    close: () => void
}

export default function EditModal({link, opened, close, domain}: ModalProps) {

  const domainName = domain === '1' ? 'https://forever-love-animals.com' : 'https://animalstrend.com';

  const initialSlug = link.split('?')[0].split('/').filter(e=>e).pop() || '';

  const [overlay, setOverlay] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('<p>Loading...</p>')
  const [error, setError] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [excerpt, setExcerpt] = useState("");
  const [slug, setSlug] = useState(initialSlug);
  const [originalContent, setOriginalContent] = useState("");

  const [featuredImage, setFeaturedImage] = useState('');
  // const [fbImage, setFbImage] = useState('');

  const [wpPost, setWpPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    setLoading(true);

    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/wordpress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish', domain, title, content, excerpt, slug, featuredImage }),
      });

      if(!res.ok){
        const json = await res.json();
        throw new Error(json.message || res.statusText);
      }

      const json = await res.json();
      setWpPost(json);

    }catch(err:any){
      console.log(err);
      setWpPost(null);
      setError(err.message);
    }
    
    setLoading(false);
    
  }

  const editor = useEditor({
      extensions: [ StarterKit, Link, 
        Image.configure({ inline: true }),
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ],
      content,
      onUpdate: useDebouncedCallback( ({ editor }) => {
        setContent(editor.getHTML());
      }, 800),
    });

    async function Rewrite(){
      setIsStreaming(true);
      abortControllerRef.current = new AbortController();

      try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/rewrite`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message:content }),
          signal: abortControllerRef.current.signal,
        });

        setContent("");
  
        const reader = res.body?.getReader();
        const decoder = new TextDecoder('utf-8');
  
          while (true) {
            const { done, value } = await reader!.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            setContent((prev) => prev + chunk);
          }

      }catch(error:any){
        if (error.name === 'AbortError') console.log('Fetch aborted');
        else console.error('Error:', error.message);
        
      }finally{ setIsStreaming(false); }
      
    };

    function removeImage(){
      //remove image from content
      const newContent = content.replace(/<img[^>]*>/g, '');
      setContent(newContent);
    }

    useEffect(() => {
      if (!editor) return;
      let {from, to} = editor.state.selection;
      editor.commands.setContent(content,
        false, {
          preserveWhitespace: "full"
        });
      editor.commands.setTextSelection({from, to});
    }, [editor, content]);

    useEffect(() => {
      setOverlay(true);
      setWpPost(null);
  
      (async () => {
        try{
          const res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/extract?url=${btoa(link)}`);
          if (!res.ok) {
            setError(`HTTP error! Status: ${res.status} - ${res.statusText}`);
            return;
          }
          const article = await res.json();
          setTitle(article.title);
          setContent(article.content);
          setOriginalContent(article.content);
          setFeaturedImage(article.image);
          // setExcerpt(article.description);
          setSlug(article.slug.split('?')[0].split('/').filter((e:string)=>e).pop() || '');
        }catch(error:any){
          setError(error.message);
        }finally{
          setOverlay(false);
        }
        
      })();
    }, [link]);


    const handleAbort = () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setIsStreaming(false);
      }
    };

  return(
  <Modal opened={opened} onClose={()=>{close(); setContent(originalContent)}} title="Edit" fullScreen pos="relative" closeOnEscape={false} closeOnClickOutside={false}>
  <LoadingOverlay visible={overlay}  />
  <Grid>
  <Grid.Col span={{base:12, md:8}}>
  <TextInput label="Title" placeholder="Title" my="sm" value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
  <RichTextEditor editor={editor}>
    <RichTextEditor.Toolbar sticky stickyOffset={60}>
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Bold />
        <RichTextEditor.Italic />
        <RichTextEditor.Strikethrough />
        <RichTextEditor.ClearFormatting />
        <RichTextEditor.Code />
        <RichTextEditor.Blockquote />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.H1 />
        <RichTextEditor.H2 />
        <RichTextEditor.H3 />
        <RichTextEditor.H4 />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.AlignLeft />
        <RichTextEditor.AlignCenter />
        <RichTextEditor.AlignJustify />
        <RichTextEditor.AlignRight />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Hr />
        <RichTextEditor.BulletList />
        <RichTextEditor.OrderedList />
        <RichTextEditor.Link />
        <RichTextEditor.Unlink />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Undo />
        <RichTextEditor.Redo />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>

        <Tooltip label="Rewrites Content. Removes credits, links, and promotions" openDelay={300} className='!text-xs'>
          <Button size='compact-sm' loading={isStreaming} variant='default' onClick={Rewrite}>Rewrite</Button>
        </Tooltip>
        <Button size='compact-sm' variant='default' onClick={removeImage}>Remove Image</Button>
        {isStreaming && <Button size='compact-sm' variant='default' onClick={handleAbort}>Cancel</Button>}
      </RichTextEditor.ControlsGroup>   
    </RichTextEditor.Toolbar>

    <div className="relative">
      <LoadingOverlay visible={isStreaming} />
      <RichTextEditor.Content />
    </div>
  </RichTextEditor>
  </Grid.Col>

  <Grid.Col span={{base:12, md:4}} className='lg:mt-5'>
  {/* <Textarea rows={6} label="Excerpt" my="sm" value={excerpt} onChange={(e) => setExcerpt(e.currentTarget.value)} /> */}
  <TextInput label="Slug" my="sm" value={slug} onChange={(e) => setSlug(e.currentTarget.value)} />
  <SimpleGrid cols={2}>
    <TextInput mb="sm" placeholder='Upload img from url if unavailable' id="image_url" />
    <Button disabled={Boolean(featuredImage)} variant='light' color='green' radius="md" onClick={() => setFeaturedImage((document.querySelector('#image_url') as HTMLInputElement)?.value)}>Upload</Button>
  </SimpleGrid>
    <Paper withBorder className='flex justify-center align-baseline'>
    {featuredImage ? (
      <div>
      <MantineImage src={featuredImage} h={300} w={300} fit='contain' />
      <Button mb="md" variant='light' size='compact-sm' color='red' radius="md" fullWidth onClick={() =>setFeaturedImage('')}>Remove Image</Button>
      </div>
    ): (
      <FileInput placeholder={<Text fz="sm" c="bright">Upload Image</Text>} my="xl" accept="image/*" onChange={(file)=>{
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => setFeaturedImage((e.target as any).result);
          reader.readAsDataURL(file);
        }
      }} />
    )}
    </Paper>
    {title && content && !wpPost && (
      <Button mt="md" variant='light' color='green' radius="md" fullWidth loading={loading} onClick={handlePublish}>Publish</Button>
    )}


  </Grid.Col>
  </Grid>
    {wpPost && (
      <Modal opened={!!wpPost} onClose={close} title="Article Published" closeOnEscape={false} closeOnClickOutside={false}>
      {/* <Text fz="sm">You can go on Home Page to see your article and post to Facebook.</Text> */}
      <NextLink href="/" className='text-sm underline'>Go to Homepage</NextLink>
        <Button mt="md" variant='light' color='green' radius="md" fullWidth component='a' href={`${domainName}/wp-admin/post.php?post=${wpPost.postid}&action=edit`} target='_blank' >Edit Article</Button>
        <SimpleGrid cols={2} mt="md">
        <Button variant='light' color='green' radius="md" component='a' href={wpPost.link} target='_blank' >View Article</Button>
        <CopyToClipboard value={wpPost.link} />
      </SimpleGrid>
      </Modal>
    )}
  </Modal>)
  
}

const CopyToClipboard = ({value}:{value:string}) => (
  <CopyButton  value={value} timeout={2000}>
  {({ copied, copy }) => (
      <Button color={copied ? 'teal' : 'gray'} variant="subtle" onClick={(e:any)=>{ e.stopPropagation(); copy()}}>
        {copied ? 'Copied' : 'Copy Link'}
      </Button>
  )}
  </CopyButton>
);