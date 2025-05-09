import {Box, Button, IconButton, Modal, TextField, Typography} from "@mui/material";
import {Gauge, gaugeClasses} from "@mui/x-charts";
import {useActions} from "./hook/useActions.tsx";
import {InsertDriveFileOutlined, Replay} from '@mui/icons-material';
import {useEffect, useState} from "react";
import Dropzone from "react-dropzone";
import {DataGrid, type GridColDef} from "@mui/x-data-grid";


function App() {
    const {message, setMessage, score, getScore, refactoring} = useActions()

    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
    const [fileContent, setFileContent] = useState('');
    const [dataGrid, setDataGrid] = useState<ListData[]>([])

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            const content = e.target?.result as string;
            setFileContent(content);
        };

        reader.readAsText(file);
    };

    useEffect(() => {
        (async () => {
            if (!fileContent) {
                setDataGrid([])
                return
            } else {
                const data = await getScore(fileContent.split("\r\n"))
                if (data)
                    setDataGrid(data)
                else
                    setDataGrid([])
            }
        })()
    }, [fileContent]);

    const columnsGrid: GridColDef[] = [
        {
            field: 'message',
            headerName: "Message",
            flex: 1
        },
        {
            field: 'score',
            headerName: "Toxic (%)",
            renderCell: (params) => (
                <Box className="flex items-center justify-center h-full">

                    <Typography sx={{
                        color: params.value > 50 ? params.value > 75 ? "#ef5350" : "#ff9800" : "#03a9f4",

                    }}>
                        {params.value}
                    </Typography>
                </Box>
            )

        },
        {
            field: "action",
            headerName: "",
            width: 40,
            renderCell: (params) => (
                <Box>{
                    params.row.score > 75 &&
                    <IconButton onClick={async () => {
                        const newMessage = await refactoring(params.row.message)
                        console.log(newMessage)
                    }}>
                        <Replay/>
                    </IconButton>
                }
                </Box>
            )
        }
    ]


    return (
        <Box
            className="flex flex-col items-center h-full w-full gap-5"
            sx={{
                height: "100vh",
                padding: "20px"
            }}
        >
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
                    [`& .${gaugeClasses.valueArc}`]: {
                        fill: score > 50 ? score > 75 ? "#ef5350" : "#ff9800" : "#03a9f4",
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
                    onClick={() => {
                        setIsOpenModal(true)
                        setFileContent('')
                    }
                    }
                    sx={{
                        position: "absolute",
                        right: "5px",
                        top: "5px",
                    }}
                >
                    <InsertDriveFileOutlined/>
                </IconButton>
            </Box>
            <Button variant="contained" disabled={score < 75} onClick={async () => {
                const newMessage = await refactoring(message)
                setMessage(newMessage);
            }}
            >
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
                    className="flex gap-2"
                    sx={{
                        bgcolor: "white",
                        padding: "20px",
                        borderRadius: "5px",
                    }}
                >
                    <Box className="flex flex-col gap-2"
                    >

                        <Typography variant="h4">
                            CSV File
                        </Typography>
                        <Dropzone onDrop={onDrop}>
                            {({getRootProps, getInputProps}) => (
                                <Box
                                    {...getRootProps()}
                                    className="flex items-center justify-center flex-1 cursor-pointer"
                                    sx={{
                                        border: "1px dashed black",
                                        // height: "80px",
                                        width: "200px",
                                        padding: "20px"
                                    }}
                                >
                                    <input {...getInputProps()} className="" accept={".csv"}/>
                                    <p>Select CSV File</p>

                                </Box>
                            )}
                        </Dropzone>
                    </Box>
                    {dataGrid.length > 0 && (
                        <DataGrid
                            columns={columnsGrid}
                            rows={dataGrid}
                        />
                    )}
                </Box>
            </Modal>

        </Box>
    );
}

export default App
