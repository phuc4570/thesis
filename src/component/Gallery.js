import React, {useEffect, useRef, useState} from "react";
import '../App.css';
import {ImageList, ImageListItem, List, ListItemButton} from "@mui/material";
import {AssetRecordType} from "tldraw";
import axios from "axios";

const port = '20211'
const backend_url = 'server.selab.edu.vn'
//const backend_url = '10.0.1.2'

const Gallery = ({editor, dimension, galleryImageNames, setGalleryImageNames}) => {

    var importSize = {
        width: 0,
        height: 0,
      }

    useEffect(() => {
        axios.get(`http://${backend_url}:${port}/api/galleryName`).then(function (response){
            setGalleryImageNames(response.data);
        });
    }, []);

    //Handle click to get an image in gallery and create an image in Canvas (import image from gallery)
    const handleImageClick = async (src) => {
        const img = new Image();
        img.src = src;
        await new Promise((resolve) => {
            img.onload = () => resolve();
          });
        var imgFitWidth = 0;
        var imgFitHeight = 0;
        if(dimension.height * (img.width/img.height) <= dimension.width){
            imgFitHeight = dimension.height
            imgFitWidth = dimension.height * (img.width/img.height)
        }else{
            imgFitWidth = dimension.width
            imgFitHeight = dimension.width * (img.height/img.width)
        }
        const imageWidth = imgFitWidth
        const imageHeight = imgFitHeight

        importSize.width = imageWidth
        importSize.height = imageHeight

        var offsetX = (dimension.width - imageWidth) / 2;
        var offsetY = (dimension.height - imageHeight) / 2;

        const assetId = AssetRecordType.createId()

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
            x: offsetX,
            y: offsetY,
            props: {
                assetId,
                w: imageWidth,
                h: imageHeight,
            },
        })

        await axios.post(`http://${backend_url}:${port}/api/import-size`,{
            width: importSize.width * 2.19393939394,
            height: importSize.height * 2.19393939394,
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
            await axios.post(`http://${backend_url}:${port}/api/upload`, formData).then(function (response){
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
                    <img className="upload-image" src="/upload.png" alt=""></img>
                </button>
                <input type="file" accept=".png" onChange={handleImageUpload} hidden={true} ref={fileInputRef}/>
            </div>
            <ImageList sx={{width: '100%', height: '75%'}} cols={1} rowHeight={164}>
                {galleryImageNames.map((imageName, index) => (
                    <div key={index}>
                        <List component="div" disablePadding>
                            <ListItemButton onClick={() => handleImageClick(`http://${backend_url}:${port}/Image/Gallery/${imageName}`)}>
                                <ImageListItem>
                                    <img
                                        srcSet={`http://${backend_url}:${port}/Image/Gallery/${imageName}`}
                                        src={`http://${backend_url}:${port}/Image/Gallery/${imageName}`}
                                        alt=""
                                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
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