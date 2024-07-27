import React, {useState} from "react";
import './Header.css';
import {
    Box,
    Collapse,
    Dialog,
    DialogTitle, FormControl, ImageList, ImageListItem, InputLabel,
    List,
    ListItemButton,
    ListItemText,
    MenuItem, Select,
} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";

//Get dir of Upload Images and define the instruction
const uploadImageImages = require.context('../../public/Image/Tutorial/UploadImage', true);
const uploadImageImageNames = uploadImageImages.keys().map((item) => item.replace('./', ''));
const uploadImageImageLabels = [
    'Click on the "Upload" button (on the top right corner).',
    'Choose the image. Then the image after upload will be on the Gallery.',
]

//Get dir of Add Mask Images and define the instruction
const addMaskImages = require.context('../../public/Image/Tutorial/AddMask', true);
const addMaskImageNames = addMaskImages.keys().map((item) => item.replace('./', ''));
const addMaskImageLabels = [
    'Click on the Bot button (on the bottom right corner).',
    'Click on Image Mask button',
    'Mask the object which you want to.',
]

//Get dir of Image Generation Images and define the instruction
const imageGenerationImages = require.context('../../public/Image/Tutorial/ImageGeneration', true);
const imageGenerationImageNames = imageGenerationImages.keys().map((item) => item.replace('./', ''));
const imageGenerationImageLabels = [
    'Draw a sketch of your idea.',
    'Add description of idea into prompt field.',
    'Click on the Bot button (on the bottom right corner).',
    'Click on Image Generation button',
]

//Get dir of Object Addition Images and define the instruction
const objectAdditionImages = require.context('../../public/Image/Tutorial/ObjectAddition', true);
const objectAdditionImageNames = objectAdditionImages.keys().map((item) => item.replace('./', ''));
const objectAdditionImageLabels = [
    'Click on the image on Gallery to add into Canvas.',
    'Add mask the region you want to add object to.',
    'Add description of idea into prompt field.',
    'Click on the Bot button (on the bottom right corner).',
    'Click on Object Addition button',
]

//Get dir of Background Alteration Images and define the instruction
const backgroundAlterationImages = require.context('../../public/Image/Tutorial/BackgroundAlteration', true);
const backgroundAlterationImageNames = backgroundAlterationImages.keys().map((item) => item.replace('./', ''));
const backgroundAlterationImageLabels = [
    'Click on the image on Gallery to add into Canvas.',
    'Add mask the region you want to keep.',
    'Add description of idea into prompt field.',
    'Click on the Bot button (on the bottom right corner).',
    'Click on Background Alteration button',
]

//Get dir of Pose Transition Images and define the instruction
const poseTransitionImages = require.context('../../public/Image/Tutorial/PoseTransition', true);
const poseTransitionImageNames = poseTransitionImages.keys().map((item) => item.replace('./', ''));
const poseTransitionImageLabels = [
    'Click on the image on Gallery to add into Canvas.',
    'Add mask the object you want to change pose.',
    'Add description of idea into prompt field.',
    'Click on the Bot button (on the bottom right corner).',
    'Click on Pose Transition button',
]

//Get dir of Object Replacement Images and define the instruction
const objectReplacementImages = require.context('../../public/Image/Tutorial/ObjectReplacement', true);
const objectReplacementImageNames = objectReplacementImages.keys().map((item) => item.replace('./', ''));
const objectReplacementImageLabels = [
    'Click on the image on Gallery to add into Canvas.',
    'Add mask the object you want to replace.',
    'Add description of idea into prompt field.',
    'Click on the Bot button (on the bottom right corner).',
    'Click on Object Replacement (Fixed) button',
    'Or click on Object Replacement (Dynamic) button',
]

//Get dir of Thematic Collection Images and define the instruction
const thematicCollectionImages = require.context('../../public/Image/Tutorial/ThematicCollection', true);
const thematicCollectionImageNames = thematicCollectionImages.keys().map((item) => item.replace('./', ''));
const thematicCollectionImageLabels = [
    'Click on the image on Gallery to add into Canvas.',
    'Add mask the object you want to replace.',
    'Add description of idea into prompt field.',
    'Click on the Bot button (on the bottom right corner).',
    'Click on Thematic Collection button',
]

//Get dir of Object Removal Images and define the instruction
const objectRemovalImages = require.context('../../public/Image/Tutorial/ObjectRemoval', true);
const objectRemovalImageNames = objectRemovalImages.keys().map((item) => item.replace('./', ''));
const objectRemovalImageLabels = [
    'Click on the image on Gallery to add into Canvas.',
    'Add mask the object you want to remove.',
    'Click on the Bot button (on the bottom right corner).',
    'Click on Object Removal button',
]

const Header = () => {
    const [open, setOpen] = React.useState(false);
    const [tutorialMode, setTutorialMode] = React.useState("UploadImage");

    //Open Tutorial popup
    const handleClickOpen = () => {
        setOpen(true);
    };

    //Close Tutorial popup
    const handleClose = () => {
        setOpen(false);
    };

    //Change Tutorial when user change the dropdown
    const handleTutorialChange = (event) => {
        setTutorialMode(event.target.value);
    };

    //Create a dropdown and change the UI base on selection of dropdown
    return (
        <header style={{background: "#495053", height: '10%', alignContent: 'center', verticalAlign: 'center'}}>
            <img className="icon" src="/Image/Home/canvas.png" width={30} height={30} alt={""}></img>
            <label className="title">EPEdit</label>
            <button className="tutorial" onClick={handleClickOpen}>Tutorials</button>
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>Tutorial</DialogTitle>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Tutorial</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={tutorialMode}
                            label="Tutorial"
                            onChange={handleTutorialChange}
                        >
                            <MenuItem value="UploadImage">Upload Image</MenuItem>
                            <MenuItem value="AddMask">Add Mask</MenuItem>
                            <MenuItem value="ImageGeneration">Image Generation</MenuItem>
                            <MenuItem value="ObjectAddition">Object Addition</MenuItem>
                            <MenuItem value="BackgroundAlteration">Background Alteration</MenuItem>
                            <MenuItem value="PoseTransition">Pose Transition</MenuItem>
                            <MenuItem value="ObjectReplacement">Object Replacement</MenuItem>
                            <MenuItem value="ThematicCollection">Thematic Collection</MenuItem>
                            <MenuItem value="ObjectRemoval">Object Removal</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                {tutorialMode === 'UploadImage' && <TutorialTab folderName={tutorialMode} imageNames={uploadImageImageNames} labels={uploadImageImageLabels}/>}
                {tutorialMode === 'AddMask' && <TutorialTab folderName={tutorialMode} imageNames={addMaskImageNames} labels={addMaskImageLabels}/>}
                {tutorialMode === 'ImageGeneration' && <TutorialTab folderName={tutorialMode} imageNames={imageGenerationImageNames} labels={imageGenerationImageLabels}/>}
                {tutorialMode === 'ObjectAddition' && <TutorialTab folderName={tutorialMode} imageNames={objectAdditionImageNames} labels={objectAdditionImageLabels}/>}
                {tutorialMode === 'BackgroundAlteration' && <TutorialTab folderName={tutorialMode} imageNames={backgroundAlterationImageNames} labels={backgroundAlterationImageLabels}/>}
                {tutorialMode === 'PoseTransition' && <TutorialTab folderName={tutorialMode} imageNames={poseTransitionImageNames} labels={poseTransitionImageLabels}/>}
                {tutorialMode === 'ObjectReplacement' && <TutorialTab folderName={tutorialMode} imageNames={objectReplacementImageNames} labels={objectReplacementImageLabels}/>}
                {tutorialMode === 'ThematicCollection' && <TutorialTab folderName={tutorialMode} imageNames={thematicCollectionImageNames} labels={thematicCollectionImageLabels}/>}
                {tutorialMode === 'ObjectRemoval' && <TutorialTab folderName={tutorialMode} imageNames={objectRemovalImageNames} labels={objectRemovalImageLabels}/>}
            </Dialog>
        </header>
    )
}

//Component display Tutorial base on the selection of dropdown
function TutorialTab({ folderName, imageNames, labels }){

    const [activeIndex, setActiveIndex] = useState(-1)

    //Open the nested component when user click on the tab
    const handleClick = (value) => {
        setActiveIndex(value)
    };

    return(
        <div>
            <List
                sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
            >
                {imageNames.map((imageName, index) => (
                    <div key={index}>
                            <ListItemButton onClick={() => {handleClick(index)}}>
                                <ListItemText primary={`Step ${index + 1}: ${labels[index]}`}/>
                                {activeIndex === index ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={activeIndex === index} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItemButton>
                                        <ImageList cols={1} rowHeight="100%">
                                            <ImageListItem>
                                                <img
                                                    srcSet={`/Image/Tutorial/${folderName}/${imageName}`}
                                                    src={`/Image/Tutorial/${folderName}/${imageName}`}
                                                    alt=""
                                                    loading="lazy"
                                                />
                                            </ImageListItem>
                                        </ImageList>
                                    </ListItemButton>
                                </List>
                            </Collapse>
                    </div>
                ))}
            </List>
        </div>
    )
}

export default Header;