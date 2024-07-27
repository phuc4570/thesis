import '../App.css';
import {
    exportToBlob,
    Tldraw,
    useEditor,
    AssetRecordType,
    createShapeId
} from 'tldraw'
import '../index.css'
import {TextField} from "@mui/material";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {CircleMenu, CircleMenuItem} from "react-circular-menu";
import axios from "axios";

const port = '20211'
const backend_url = 'server.selab.edu.vn'
//const backend_url = '10.0.1.2'

const Paint = ({setEditor, setDimension, setGalleryImageNames}) => {

    const [paintEditor, setPaintEditor] = useState(useEditor());
    const [paintDimension, setPaintDimension] = useState({
        width: 0,
        height: 0,
    });

    var isInit = false;

    //variable for Prompt
    const [prompt, setPrompt] = useState("anime");

    //user Reference to Container of Paint component
    const refContainer = useRef();

    //Get Editor
    const handleMount = useCallback((editor) => {
        setEditor(editor)
        setPaintEditor(editor);
        if(!isInit){
            isInit = true
            const assetId = AssetRecordType.createId()
            const imageWidth = paintDimension.width
            const imageHeight = paintDimension.height
            editor.createAssets([
                {
                    id: assetId,
                    type: 'image',
                    typeName: 'asset',
                    props: {
                        name: 'tldraw.png',
                        src: ``,
                        w: imageWidth,
                        h: imageHeight,
                        mimeType: 'image/png',
                        isAnimated: false,
                    },
                    meta: {},
                },
            ])
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
    }, [paintDimension])

    const [isShowAlgorithm, setIsShowAlgorithm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [feature, setFeature] = useState("ImageSketch");
    const [algorithmName, setAlgorithmName] = useState("CPAM")
    var maskBGShapeId;
    var maskIDs = [];
    var shapes = [];
    const [isGetMask, setIsGetMask] = useState(false);

    const toggleAlgorithmUI = () => {
        setIsShowAlgorithm(!isShowAlgorithm)
    }

    const sendInput = async () =>{
        //Send Content
        await exportToBlob({
            editor: paintEditor, // Your editor instance
            format: "png",
            ids: shapes,
        }).then(async (blob) => {
            const formData = new FormData();
            formData.append('file', blob);
            await axios.post(`http://${backend_url}:${port}/api/input`, formData).then(function (response){
                console.log("input response: " + response.data)
            })
        })
    }

    const sendMask = async () =>{
        //Send Mask
        await exportToBlob({
            editor: paintEditor, // Your editor instance
            format: "png",
            ids: maskIDs,
        }).then(async (blob) => {
            const formData = new FormData();
            formData.append('file', blob);
            paintEditor.deleteShapes(maskIDs);
            await axios.post(`http://${backend_url}:${port}/api/mask`, formData).then(function(response){
                console.log("mask response: " + response.data);
            });
        })
    }

    const getContentImage = async () => {
        shapes = paintEditor.getCurrentPageShapeIds();
        const shapesInOrder = paintEditor.getCurrentPageShapesSorted();

        if(isGetMask){
            shapes = [];
            var maskStartIndex = 0;
            for(let i = 0; i < shapesInOrder.length; i++){
                if(shapesInOrder[i].id === "shape:MaskBGShapeID"){
                    maskStartIndex = i;
                    break;
                }
            }
            for(let i = maskStartIndex; i < shapesInOrder.length; i++){
                maskIDs.push(shapesInOrder[i].id);
            }
            for(let i = 0; i < maskStartIndex; i++){
                shapes.push(shapesInOrder[i].id);
            }
        }else{
            maskBGShapeId = createShapeId("MaskBGShapeID");
            setFeature("ImageMask")
            paintEditor.createShape({
                id: maskBGShapeId,
                type: 'image', // Use your custom shape type
                x: 0, // Set the X position
                y: 0, // Set the Y position
                props: {
                    w: paintDimension.width, // Width of the rectangle
                    h: paintDimension.height, // Height of the rectangle
                    // Add other shape-specific properties here
                },
            });
            paintEditor.select(maskBGShapeId);
            paintEditor.setOpacityForSelectedShapes(0);
            maskIDs.push(maskBGShapeId);
        }
        setIsGetMask(false);
        await Promise.all([sendInput(), sendMask()]).then(() => {
            console.log("done Promise all");
        })
    }

    const handleMask = () => {
        setIsGetMask(true);
        maskBGShapeId = createShapeId("MaskBGShapeID");
        setFeature("ImageMask")
        paintEditor.createShape({
            id: maskBGShapeId,
            type: 'image', // Use your custom shape type
            x: 0, // Set the X position
            y: 0, // Set the Y position
            props: {
                w: paintDimension.width, // Width of the rectangle
                h: paintDimension.height, // Height of the rectangle
                // Add other shape-specific properties here
            },
        });
        paintEditor.select(maskBGShapeId);
        paintEditor.setOpacityForSelectedShapes(0.5);
        paintEditor.setCurrentTool('highlight');
    }

    const handleGeneration = async () => {
        setFeature("ImageGeneration")
        setAlgorithmName("Diffusion")
        toggleAlgorithmUI();
    }

    const handleAddition = async () => {
        setFeature("ImageAddition")
        setAlgorithmName("CPAM")
        toggleAlgorithmUI();
    }

    const handleBackgroundAlteration = async () => {
        setFeature("BackgroundAlteration")
        setAlgorithmName("CPAM")
        toggleAlgorithmUI();
    }
    
    const handlePoseTransition = async () => {
        setFeature("ImagePoseTransition")
        setAlgorithmName("CPAM")
        toggleAlgorithmUI();
    }

    const handleFixedReplacement = async () => {
        setFeature("ImageReplacement_Fixed")
        setAlgorithmName("CPAM")
        toggleAlgorithmUI();
    }

    const handleDynamicReplacement = async () => {
        setFeature("ImageReplacement_Fixed")
        setAlgorithmName("CPAM")
        toggleAlgorithmUI();
    }

    const handleFixedThematicCollection = async () => {
        setFeature("FixedThematicCollection")
        setAlgorithmName("CPAM")
        toggleAlgorithmUI();
    }

    const handleThematicCollection = async () => {
        setFeature("ThematicCollection")
        setAlgorithmName("CPAM")
        toggleAlgorithmUI();
    }

    const handleRemoval = async () => {
        setFeature("ObjectRemoval")
        setAlgorithmName("CPAM")
        toggleAlgorithmUI();
    }

    const handleChooseAlgorithm = async (algorithm)=>{
        toggleAlgorithmUI();
        setIsLoading(true);
        paintEditor.setCurrentTool('draw');
        await getContentImage()
        switch (feature) {
            case "ImageGeneration":
                await axios.post(`http://${backend_url}:${port}/api/image_generation`,{
                    text: prompt
                }).then(function (response){
                    getResult();
                });
                break;
            case "ImageAddition":
                await axios.post(`http://${backend_url}:${port}/api/add_item`,{
                    text: prompt
                }).then(function (response){
                    getResult();
                });
                break;
            case "BackgroundAlteration":
                await axios.post(`http://${backend_url}:${port}/api/alter_background`,{
                    text: prompt
                }).then(function (response){
                    getResult();
                });
                break;
            case "ImagePoseTransition":
                await axios.post(`http://${backend_url}:${port}/api/change_pose_view`,{
                    text: prompt
                }).then(function (response){
                    getResult();
                });
                break;
            case "ImageReplacement_Fixed":
                await axios.post(`http://${backend_url}:${port}/api/replace_object_fixed`,{
                    text: prompt
                }).then(function (response){
                    getResult();
                });
                break;
            case "ImageReplacement_Dynamic":
                await axios.post(`http://${backend_url}:${port}/api/replace_object_dynamic`,{
                    text: prompt
                }).then(function (response){
                    getResult();
                });
                break;
            case "ThematicCollection":
                await axios.post(`http://${backend_url}:${port}/api/thematic_collection`,{
                    text: prompt
                }).then(function (response){
                    getResult();
                });
                break;
            case "FixedThematicCollection":
                await axios.post(`http://${backend_url}:${port}/api/thematic_collection_fixed`,{
                    text: prompt
                }).then(function (response){
                    getResult();
                });
                break;
            case "ObjectRemoval":
                await axios.post(`http://${backend_url}:${port}/api/remove_object`,{
                    text: prompt
                }).then(function (response){
                    getResult();
                });
                break;
            default:
                break;
        }
    }

    const getResult = async () => {
        console.log("getResult")
        setGifSource(listGifSource[0]);
        setIsLoading(false);

        const img = new Image();
        img.src = `http://${backend_url}:${port}/Image/Paint/Output/output.png?timestamp=${Date.now()}`;
        await new Promise((resolve) => {
            img.onload = () => resolve();
          });
        var imgFitWidth = 0;
        var imgFitHeight = 0;
        if(paintDimension.height * (img.width/img.height) <= paintDimension.width){
            imgFitHeight = paintDimension.height
            imgFitWidth = paintDimension.height * (img.width/img.height)
        }else{
            imgFitWidth = paintDimension.width
            imgFitHeight = paintDimension.width * (img.height/img.width)
        }
        const imageWidth = imgFitWidth
        const imageHeight = imgFitHeight

        var offsetX = (paintDimension.width - imageWidth) / 2;
        var offsetY = (paintDimension.height - imageHeight) / 2;

        const assetId = AssetRecordType.createId()
        //[2]
        paintEditor.createAssets([
            {
                id: assetId,
                type: 'image',
                typeName: 'asset',
                props: {
                    name: 'tldraw.png',
                    src: `http://${backend_url}:${port}/Image/Paint/Output/output.png?timestamp=${Date.now()}`,
                    w: imageWidth,
                    h: imageHeight,
                    mimeType: 'image/png',
                    isAnimated: false,
                },
                meta: {},
            },
        ])
        //[3]
        paintEditor.createShape({
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

        //update gallery
        axios.get(`http://${backend_url}:${port}/api/galleryName`).then(function (response){
            setGalleryImageNames(response.data);
        });
    }

    //Get width and height of Dimension
    useEffect(() => {
        if (refContainer.current) {
            setDimension({
                width: refContainer.current.offsetWidth,
                height: refContainer.current.offsetHeight,
            });
            setPaintDimension({
                width: refContainer.current.offsetWidth,
                height: refContainer.current.offsetHeight,
            })
        }
    }, []);

    //List of sources of animation gif for chatbot
    const listGifSource = ["/GIF/idle-unscreen.gif", "/GIF/loading-unscreen.gif"]
    var index = 0;

    //Variable hold source of animation gif for chatbot
    const [gifSource, setGifSource] = useState(listGifSource[0])

    return (
        <div className="paint" ref={refContainer}>
            <Tldraw onMount={handleMount}/>
            <div className="prompt">
                <TextField
                    value={prompt}
                    onChange={(event) => {
                        setPrompt(event.target.value);
                    }}
                    fullWidth id="standard-basic" label="Prompt" variant="filled" />
            </div>
            {isLoading &&
                <div className="loading-bubble">
                    <div className="moving-image">
                        <img src={"/Image/Home/bubblebox.png"} width={112.5} height={80} alt={""}></img>
                        <div className="loading-text-overlay">Loading...</div>
                    </div>
                </div>
            }
            <div className="chatbot">
                {isShowAlgorithm &&
                    <CircleMenu
                        startAngle={-90}
                        rotationAngle={180}
                        itemSize={3}
                        radius={7}
                        /**
                         * rotationAngleInclusive (default true)
                         * Whether to include the ending angle in rotation because an
                         * item at 360deg is the same as an item at 0deg if inclusive.
                         * Leave this prop for angles other than 360deg unless otherwise desired.
                         */
                        rotationAngleInclusive={false}
                        menuToggleElement={<img src={gifSource} width={225} height={168.75} alt={""}></img>}
                        onMenuToggle={(menuActive) => {
                            if(menuActive){
                                index = 1
                            }
                            else {
                                index = 0
                            }
                            setGifSource(listGifSource[index]);
                        }}
                        open={true}
                    >
                        <CircleMenuItem onClick={() => handleChooseAlgorithm(1)} tooltip="Algorithm 1"  className="functional-button-text">
                            {algorithmName}
                        </CircleMenuItem>
                    </CircleMenu>
                }
                {!isShowAlgorithm &&
                    <CircleMenu
                        startAngle={-180}
                        rotationAngle={360}
                        itemSize={2.5}
                        radius={7.5}
                        /**
                         * rotationAngleInclusive (default true)
                         * Whether to include the ending angle in rotation because an
                         * item at 360deg is the same as an item at 0deg if inclusive.
                         * Leave this prop for angles other than 360deg unless otherwise desired.
                         */
                        rotationAngleInclusive={false}
                        menuToggleElement={<img src={gifSource} width={225} height={168.75} alt={""}></img>}
                        onMenuToggle={(menuActive) => {
                            if(menuActive){
                                index = 1
                            }
                            else {
                                index = 0
                            }
                            setGifSource(listGifSource[index]);
                        }}
                    >
                        <CircleMenuItem onClick={handleMask} tooltip="Image Mask" className="functional-button-text">
                            <img src="/Image/Paint/image-mask.png" width="30px" height="30px" alt=''></img>
                        </CircleMenuItem>
                        <CircleMenuItem onClick={handleGeneration} tooltip="Image Generation" className="functional-button-text">
                            <img src="/Image/Paint/image-generation.png" width="30px" height="30px" alt=''></img>
                        </CircleMenuItem>
                        <CircleMenuItem onClick={handleAddition} tooltip="Object Addition" className="functional-button-text">
                            <img src="/Image/Paint/object-addition.png" width="30px" height="30px" alt=''></img>
                        </CircleMenuItem>
                        <CircleMenuItem onClick={handleBackgroundAlteration} tooltip="Background Alteration" className="functional-button-text">
                            <img src="/Image/Paint/background-alteration.png" width="30px" height="30px" alt=''></img>
                        </CircleMenuItem>
                        <CircleMenuItem onClick={handlePoseTransition} tooltip="Pose Transition" className="functional-button-text">
                            <img src="/Image/Paint/pose-transition.png" width="30px" height="30px" alt=''></img>
                        </CircleMenuItem>
                        <CircleMenuItem onClick={handleFixedReplacement} tooltip="Object Replacement (Fixed)" className="functional-button-text">
                            <img src="/Image/Paint/object-adjustment-fixed.png" width="30px" height="30px" alt=''></img>
                        </CircleMenuItem>
                        <CircleMenuItem onClick={handleDynamicReplacement} tooltip="Object Replacement (Dynamic)" className="functional-button-text">
                            <img src="/Image/Paint/object-adjustment-dynamic.png" width="30px" height="30px" alt=''></img>
                        </CircleMenuItem>
                        <CircleMenuItem onClick={handleFixedThematicCollection} tooltip="Fixed Thematic Collection" className="functional-button-text">
                            <img src="/Image/Paint/concept-generation-fixed.png" width="30px" height="30px" alt=''></img>
                        </CircleMenuItem>
                        <CircleMenuItem onClick={handleThematicCollection} tooltip="Thematic Collection" className="functional-button-text">
                            <img src="/Image/Paint/concept-generation.png" width="30px" height="30px" alt=''></img>
                        </CircleMenuItem>
                        <CircleMenuItem onClick={handleRemoval} tooltip="Object Removal" className="functional-button-text">
                            <img src="/Image/Paint/remove-object.png" width="30px" height="30px" alt=''></img>
                        </CircleMenuItem>
                    </CircleMenu>
                }
            </div>
        </div>
    )
}

export default Paint;