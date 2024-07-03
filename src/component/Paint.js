import '../App.css';
import {
    exportAs,
    exportToBlob,
    Tldraw,
    useEditor,
    useLocalStorageState,
    TLBaseShape,
    AssetRecordType,
    createShapeId
} from 'tldraw'
import '../index.css'
import {ImageListItem, List, ListItemButton, TextField} from "@mui/material";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {CircleMenu, CircleMenuItem, TooltipPlacement} from "react-circular-menu";
import axios from "axios";

const port = '20111'

const Paint = ({setEditor, setDimension}) => {

    const [paintEditor, setPaintEditor] = useState(useEditor());
    const [paintDimension, setPaintDimension] = useState({
        width: 0,
        height: 0,
    });

    var isInit = false;

    //variable for Prompt
    const [prompt, setPrompt] = useState("");

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
    const [feature, setFeature] = useState("ImageSketch");
    var maskBGShapeId;
    var maskIDs = [];
    const [isGetMask, setIsGetMask] = useState(false);

    const toggleAlgorithmUI = () => {
        setIsShowAlgorithm(!isShowAlgorithm)
    }

    const getContentImage = async () => {
        var shapes = paintEditor.getCurrentPageShapeIds();
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
        //Send Content
        exportToBlob({
            editor: paintEditor, // Your editor instance
            format: "png",
            ids: shapes,
        }).then(async (blob) => {
            const formData = new FormData();
            formData.append('file', blob);
            await axios.post(`http://localhost:${port}/api/input`, formData);
        })

        //Send Mask
        exportToBlob({
            editor: paintEditor, // Your editor instance
            format: "png",
            ids: maskIDs,
        }).then(async (blob) => {
            const formData = new FormData();
            formData.append('file', blob);
            paintEditor.deleteShapes(maskIDs);
            await axios.post(`http://localhost:${port}/api/mask`, formData);
        })
    }

    const handleSketch = () =>{
        setFeature("ImageSketch")
        toggleAlgorithmUI();
    }

    const handleGeneration = async () => {
        setFeature("ImageGeneration")
        toggleAlgorithmUI();
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

    const handleAdjustment = async () => {
        setFeature("ImageAdjustment")
        toggleAlgorithmUI();
    }

    const handleAddition = async () => {
        setFeature("ImageAddition")
        toggleAlgorithmUI();
    }

    const handleConceptGeneration = async () => {
        setFeature("ImageConceptGeneration")
        toggleAlgorithmUI();
    }

    const handlePoseTransition = async () => {
        setFeature("ImagePoseTransition")
        toggleAlgorithmUI();
    }

    const handleChooseAlgorithm = async (algorithm)=>{
        toggleAlgorithmUI();
        paintEditor.setCurrentTool('draw');
        await getContentImage().then(async () => {
            switch (feature) {
                case "ImageSketch":
                    await axios.post(`http://localhost:${port}/api/image-sketch`,{
                        text: prompt
                    }).then(function (response){
                        getResult();
                    });
                    break;
                case "ImageGeneration":
                    await axios.post(`http://localhost:${port}/api/image-generation`,{
                        text: prompt
                    }).then(function (response){
                        getResult();
                    });
                    break;
                case "ImageAdjustment":
                    await axios.post(`http://localhost:${port}/api/object-adjustment`,{
                        text: prompt
                    }).then(function (response){
                        getResult();
                    });
                    break;
                case "ImageAddition":
                    await axios.post(`http://localhost:${port}/api/object-addition`,{
                        text: prompt
                    }).then(function (response){
                        getResult();
                    });
                    break;
                case "ImageConceptGeneration":
                    await axios.post(`http://localhost:${port}/api/concept-generation`,{
                        text: prompt
                    }).then(function (response){
                        getResult();
                    });
                    break;
                case "ImagePoseTransition":
                    await axios.post(`http://localhost:${port}/api/pose-transition`,{
                        text: prompt
                    }).then(function (response){
                        getResult();
                    });
                    break;
                default:
                    break;
            }
        });
    }

    const getResult = () => {
        const assetId = AssetRecordType.createId()
        const imageWidth = paintDimension.width
        const imageHeight = paintDimension.height
        //[2]
        paintEditor.createAssets([
            {
                id: assetId,
                type: 'image',
                typeName: 'asset',
                props: {
                    name: 'tldraw.png',
                    src: `http://localhost:${port}/Image/Paint/Output/output.png`,
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
            x: 0,
            y: 0,
            props: {
                assetId,
                w: imageWidth,
                h: imageHeight,
            },
        })
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
            <div className="chatbot">
                {isShowAlgorithm &&
                    <CircleMenu
                        startAngle={-180}
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
                            1
                        </CircleMenuItem>
                        <CircleMenuItem onClick={() => handleChooseAlgorithm(2)} tooltip="Algorithm 2"  className="functional-button-text">
                            2
                        </CircleMenuItem>
                        <CircleMenuItem onClick={() => handleChooseAlgorithm(3)} tooltip="Algorithm 3"  className="functional-button-text">
                            3
                        </CircleMenuItem>
                    </CircleMenu>
                }
                {!isShowAlgorithm &&
                    <CircleMenu
                        startAngle={-180}
                        rotationAngle={360}
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
                    >
                        <CircleMenuItem onClick={handleSketch} tooltip="Image Sketch" className="functional-button-text">
                            <img src="/Image/Paint/image-sketch.png" width="30px" height="30px"></img>
                        </CircleMenuItem>
                        <CircleMenuItem onClick={handleGeneration} tooltip="Image Generation" className="functional-button-text">
                            <img src="/Image/Paint/image-generation.png" width="30px" height="30px"></img>
                        </CircleMenuItem>
                        <CircleMenuItem onClick={handleMask} tooltip="Image Mask" className="functional-button-text">
                            <img src="/Image/Paint/image-mask.png" width="30px" height="30px"></img>
                        </CircleMenuItem>
                        <CircleMenuItem onClick={handleAdjustment} tooltip="Object Adjustment" className="functional-button-text">
                            <img src="/Image/Paint/object-adjustment.png" width="30px" height="30px"></img>
                        </CircleMenuItem>
                        <CircleMenuItem onClick={handleAddition} tooltip="Object Addition" className="functional-button-text">
                            <img src="/Image/Paint/object-addition.png" width="30px" height="30px"></img>
                        </CircleMenuItem>
                        <CircleMenuItem onClick={handleConceptGeneration} tooltip="Concept Generation" className="functional-button-text">
                            <img src="/Image/Paint/concept-generation.png" width="30px" height="30px"></img>
                        </CircleMenuItem>
                        <CircleMenuItem onClick={handlePoseTransition} tooltip="Pose Transition" className="functional-button-text">
                            <img src="/Image/Paint/pose-transition.png" width="30px" height="30px"></img>
                        </CircleMenuItem>
                    </CircleMenu>
                }
            </div>
        </div>
    )
}

export default Paint;