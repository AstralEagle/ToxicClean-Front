import './App.css'
import {Box, Button, IconButton, Modal, TextField, Typography} from "@mui/material";
import {Gauge} from "@mui/x-charts";
import {useActions} from "./hook/useActions.tsx";
import {InsertDriveFileOutlined} from '@mui/icons-material';
import {useState} from "react";
import Dropzone from "react-dropzone";

function App() {
    const {message, setMessage, score} = useActions()
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)



    return (
        <Box className="flex flex-col items-center h-full w-full gap-5">
            <Gauge
                value={score}
                startAngle={-110}
                endAngle={110}
                sx={{
                    width: "300px",
                    "& .MuiGauge-valueText": {
                        fontSize: 40,
                        transform: 'translate(0px, 0px)',
                    },
                }}
                text={({value}) => `${value}%`}
            />
            <Box
                className="relative"
                sx={{
                    width: "600px",
                    height: "200px",
                }}
            >
                <TextField
                    placeholder="Placeholder"
                    multiline
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{
                        width: "600px",
                        "& .MuiInputBase-root": {
                            height: "200px",
                            alignItems: "baseline",
                        }
                    }}
                />
                <IconButton
                    onClick={() => setIsOpenModal(true)}
                    sx={{
                        position: "absolute",
                        right: "5px",
                        top: "5px",
                    }}
                >
                    <InsertDriveFileOutlined/>
                </IconButton>
            </Box>
            <Button variant="contained" disabled={score < 75}>
                Refactoring
            </Button>

            <Modal
                open={isOpenModal}
                onClose={() => setIsOpenModal(false)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        bgcolor: "white",
                        padding: "20px",
                        borderRadius: "5px",
                    }}
                >
                    <Typography variant="h4" >
                        CSV File
                    </Typography>
                    <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
                        {({getRootProps, getInputProps}) => (
                            <Box
                                className="flex items-center justify-center"
                            sx={{
                                border: "1px dashed black",
                                height: "80px",
                                width: "200px",
                                padding: "20px"
                            }}
                            >
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <p>Select CSV File</p>
                                </div>
                            </Box>
                        )}
                    </Dropzone>
                </Box>
            </Modal>

        </Box>
    );
}

export default App
