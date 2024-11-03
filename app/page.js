"use client"
import { Button, Container, SimpleGrid, TextInput, Select } from "@mantine/core";
import EditModal from "..//components/Modal";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";

export default function Universal() {
    const [link, setLink] = useState('');
    const [modalopened, modal] = useDisclosure(false);
    const [selectedDomain, setSelectedDomain] = useState('1');

    return(
            <Container size="md" mt="lg">
                <h1 className="text-3xl">Universal Scraper</h1>
                <TextInput mt={10} placeholder="Enter URL" value={link} onChange={(e) => setLink(e.target.value)} />
                <Select
                    label="Select Domain"
                    value={selectedDomain}
                    onChange={(value) => setSelectedDomain(value || '1')}
                    data={[
                        { value: '1', label: 'Forever Love' },
                        { value: '2', label: 'Animals Trend' },
                    ]}
                    my="sm"
                />
                <SimpleGrid cols={2}>
                <Button mt={10} onClick={modal.open}>Scrape</Button>
                <Button color="red" mt={10} onClick={ () => setLink('') }>Clear</Button>
                </SimpleGrid>

                {link && modalopened && (
                    <EditModal link={link} opened={modalopened} domain={selectedDomain} close={modal.close} />
                )}

            </Container>
    );
}