import React, {useEffect, useRef, useState} from "react";
import '../App.css';
import {ImageList, ImageListItem, List, ListItem, ListItemButton} from "@mui/material";
import {AssetRecordType, useEditor} from "tldraw";
import axios from "axios";

//Get Folder Source
var galleryImage = require.context('../../public/Image/Gallery', true);

const port = '20111'

const Gallery = ({editor, dimension}) => {

    const [galleryImageNames, setGalleryImageNames] = useState(galleryImage.keys().map((item) => item.replace('./', '')));

    useEffect(() => {
        axios.get(`http://localhost:${port}/api/galleryName`).then(function (response){
            setGalleryImageNames(response.data);
        });
    });

    //Handle click to get an image in gallery and create an image in Canvas (import image from gallery)
    const handleImageClick = (src) => {
        //[2]
        const assetId = AssetRecordType.createId()
        const imageWidth = dimension.width
        const imageHeight = dimension.height
        //[2]
        editor.createAssets([
            {
                id: assetId,
                type: 'image',
                typeName: 'asset',
                props: {
                    name: 'tldraw.png',
                    src: `${src}`,
                    w: imageWidth,
                    h: imageHeight,
                    mimeType: 'image/png',
                    isAnimated: false,
                },
                meta: {},
            },
        ])
        //[3]
        editor.createShape({
            type: 'image',
            // Let's center the image in the editor
            x: 0,
            y: 0,
            props: {
                assetId,
                w: imageWidth,
                h: imageHeight,
            },
        })
    }

    const fileInputRef = useRef();
    var selectedFile;
    //const [selectedFile, setSelectedFile] = useState();
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        selectedFile = file
        handleUpload();
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
            await axios.post(`http://localhost:${port}/api/upload`, formData).then(function (response){
                setGalleryImageNames(response.data);
            });
            console.log('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    return (
        <div className="gallery">
            <div>
                <button className="upload-button" onClick={() => fileInputRef.current.click()}>
                    <img className="upload-image" src="/upload.png"></img>
                </button>
                <input type="file" accept=".png" onChange={handleImageUpload} hidden={true} ref={fileInputRef}/>
            </div>
            <ImageList sx={{width: '100%', height: '75%'}} cols={1} rowHeight={164}>
                {galleryImageNames.map((imageName, index) => (
                    <div key={index}>
                        <List component="div" disablePadding>
                            <ListItemButton onClick={() => handleImageClick(`http://localhost:${port}/Image/Gallery/${imageName}`)}>
                                <ImageListItem>
                                    <img
                                        srcSet={`http://localhost:${port}/Image/Gallery/${imageName}`}
                                        src={`http://localhost:${port}/Image/Gallery/${imageName}`}
                                        alt=""
                                        loading="lazy"
                                    />
                                </ImageListItem>
                            </ListItemButton>
                        </List>
                    </div>
                ))}
            </ImageList>
        </div>
    )
}

export default Gallery;