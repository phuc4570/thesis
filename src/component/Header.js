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

//Get dir of Add Prompt Images and define the instruction
const addPromptImages = require.context('../../public/Image/Tutorial/AddPrompt', true);
const addPromptImageNames = addPromptImages.keys().map((item) => item.replace('./', ''));
const addPromptLabels = [
    'Choose "Generate new room" mode',
    'Describe how you want your to look like',
    'Choose a layout type.\n    - Only text: Generate image from your description only\n    - Sketch image: Generate image from your description and your layout guidance',
    '(Optional) If the type "Sketch image" is selected, you need to upload your sketch image or pick one from the gallery',
    'Click "Generate"'
]

//Get dir of Prompt To Sketch Images and define the instruction
const promptToSketchImages = require.context('../../public/Image/Tutorial/PromptToSketch', true);
const promptToSketchImageNames = promptToSketchImages.keys().map((item) => item.replace('./', ''));
const promptToSketchLabels = [
    'Choose "Change room\'s style" mode',
    'Upload your image, or select from the gallery',
    'Describe the new style for your room',
    'Choose a layout type:\n    - Image gradients: The details of the shapes in the original image are preserved.\n    - Depth information: The depth of the objects is preserved, and the system will be slightly more creative.\n    - Line sketch: Only the straight lines in the image are preserved, allowing the system to be more creative.',
    'Click "Generate"'
]

//Get dir of Edit Sketch Images and define the instruction
const editSketchImages = require.context('../../public/Image/Tutorial/EditSketch', true);
const editSketchImageNames = editSketchImages.keys().map((item) => item.replace('./', ''));
const editSketchLabels = [
    'Choose "Edit room with masks"',
    'Upload your image, or select from the gallery',
    'Describe what you want to edit.\n    - For changing object, you should provide the details of the new object.\n    - For removing object, you should describe the background of the object that you want to remove, such as wall, floor, ceiling...',
    'Choose a layout mode. Choose "Only text" if you don\'t want to keep the original shape of the objects, otherwise:\n    - Image gradients: The details of the shapes of the objects are preserved.\n    - Depth information: The depth of the objects is preserved.\n    - Line sketch: The straight lines of the objects are preserved.',
    'Choose object / area that you want to edit:\n    - Automatic:\n        + Clicking: click on the object that you want to edit\n        + Bounding box: click and then drag to cover the object that you want to edit\n    - Manual: draw the mask on the object that you want to edit',
    'To achieve better results:\n    - The masks should have a simple shape (such as square, circle, oval, etc.)\n    - The masks should not overfit the the object',
    'Click "Generate"'
]

//Get dir of Replace Object Images and define the instruction
const replaceObjectImages = require.context('../../public/Image/Tutorial/ReplaceObject', true);
const replaceObjectImageNames = replaceObjectImages.keys().map((item) => item.replace('./', ''));
const replaceObjectLabels = [
    'Choose "Edit room with strokes"',
    'Upload your image, or select from the gallery',
    'Describe what you want to edit. The description should avoid contradictions with the strokes you are about to draw.',
    'Choose a layout mode. Choose "Only text" if you don\'t want to keep the original shape of the objects, otherwise:\n    - Image gradients: The details of the shapes of the objects are preserved.\n    - Depth information: The depth of the objects is preserved.\n    - Line sketch: The straight lines of the objects are preserved.',
    'Pick stroke color and size',
    'Draw strokes. Note that only the regions you draw on are edited.\nCurrently, the system works fine when you use warm colors (red, orange, yellow, etc.) or white.\nCool colors (green, blue) mostly produce undesirable results.',
    'Click "Generate"'
]

//Get dir of Download Images and define the instruction
const howToDownloadImages = require.context('../../public/Image/Tutorial/HowToDownload', true);
const howToDownloadImageNames = howToDownloadImages.keys().map((item) => item.replace('./', ''));
const howToDownloadLabels = [
    'Choose "Edit room with strokes"',
    'Upload your image, or select from the gallery',
    'Describe what you want to edit. The description should avoid contradictions with the strokes you are about to draw.',
    'Choose a layout mode. Choose "Only text" if you don\'t want to keep the original shape of the objects, otherwise:\n    - Image gradients: The details of the shapes of the objects are preserved.\n    - Depth information: The depth of the objects is preserved.\n    - Line sketch: The straight lines of the objects are preserved.',
    'Pick stroke color and size',
    'Draw strokes. Note that only the regions you draw on are edited.\nCurrently, the system works fine when you use warm colors (red, orange, yellow, etc.) or white.\nCool colors (green, blue) mostly produce undesirable results.',
    'Click "Generate"'
]

const Header = () => {
    const [open, setOpen] = React.useState(false);
    const [tutorialMode, setTutorialMode] = React.useState("AddPrompt");

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
            <label className="title">ArtiCanvas</label>
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
                            <MenuItem value="AddPrompt">AddPrompt</MenuItem>
                            <MenuItem value="PromptToSketch">PromptToSketch</MenuItem>
                            <MenuItem value="EditSketch">EditSketch</MenuItem>
                            <MenuItem value="ReplaceObject">ReplaceObject</MenuItem>
                            <MenuItem value="HowToDownload">HowToDownload</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                {tutorialMode === 'AddPrompt' && <TutorialTab folderName={tutorialMode} imageNames={addPromptImageNames} labels={addPromptLabels}/>}
                {tutorialMode === 'PromptToSketch' && <TutorialTab folderName={tutorialMode} imageNames={promptToSketchImageNames} labels={promptToSketchLabels}/>}
                {tutorialMode === 'EditSketch' && <TutorialTab folderName={tutorialMode} imageNames={editSketchImageNames} labels={editSketchLabels}/>}
                {tutorialMode === 'ReplaceObject' && <TutorialTab folderName={tutorialMode} imageNames={replaceObjectImageNames} labels={replaceObjectLabels}/>}
                {tutorialMode === 'HowToDownload' && <TutorialTab folderName={tutorialMode} imageNames={howToDownloadImageNames} labels={howToDownloadLabels}/>}
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