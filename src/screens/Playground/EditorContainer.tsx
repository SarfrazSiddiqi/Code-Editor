import React, { useState, useContext } from "react";
import { BiEditAlt, BiExport, BiFullscreen, BiImport } from "react-icons/bi";
import styled from "styled-components";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Select from "react-select";
import CodeEditor from "./CodeEditor";
import { ModalContext } from "../../context/ModalContext";
import { RiFolderForbidFill } from "react-icons/ri";
import { languageMap } from "../../context/PlaygroundContext";


const StyledEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const UpperToolbar = styled.div`
  background: white;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  h3 {
    font-size: 1.3rem;
  }
  button {
    background: transparent;
    font-size: 1.3rem;
    border: 0;
    outline: 0;
  }
`;

const LowerToolbar = styled.div`
  background: white;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  
  button, label {
    background: transparent;
    outline: 0;
    border: 0;
    font-size: 1.15rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    svg {
      font-size: 1.4rem;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2.5rem;
`;

const RunCode = styled.button`
  padding: 0.8rem 2rem;
  background-color: #0097d7 !important;
  color: white;
  font-weight: 700;
  border-radius: 2rem;
`;
const SaveCode = styled.button`
  padding: 0.4rem 1rem;
  background-color: #0097d7 !important;
  color: white;
  font-weight: 700;
  border-radius: 2rem;
  border: 0;
`;

const SelectBars = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  & > div:nth-of-type(1) {
    width: 10rem;
  }
  & > div:nth-of-type(2) {
    width: 11rem;
  }
`;
interface EditorContainerProps {
   title: string;
   currentLanguage: string;
   setCurrentLanguage:(newLang: string) => void;
   currentCode: string;
   setCurrentCode:(newCode: string) =>void;
   saveCode:()=> void;
   folderId: string;
   cardId: string;
   runCode: () => void;
}


const EditorContainer: React.FC<EditorContainerProps> = ({
    title,
    currentLanguage,
    setCurrentLanguage,
    currentCode,
    setCurrentCode,
    folderId,
    cardId,
    saveCode,
    runCode,
})=> {
   // import open modal function
   const {openModal} = useContext(ModalContext)!;

  const languageOptions = [
    { value: "c++", label: "C++" },
    { value: "java", label: "Java" },
    { value: "python", label: "Python" },
    { value: "javascript", label: "JavaScript" },
  ];

  const themeOptions = [
    { value: "duotoneLight", label: "duotoneLight" },
    { value: "duotoneDark", label: "duotoneDark" },
    { value: "xcodeLight", label: "xcodeLight" },
    { value: "xcodeDark", label: "xcodeDark" },
    { value: "okaidia", label: "okaidia" },
    { value: "githubDark", label: "githubDark" },
    { value: "githubLight", label: "githubLight" },
    { value: "bespin", label: "bespin" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(() =>{
     for(let i=0; i<languageOptions.length; i++){
       if(languageOptions[i].value === currentLanguage) return languageOptions[i];
     }

     return languageOptions[0];
  }     
  );
  const [selectedTheme, setSelectedTheme] = useState({
    value: "githubDark",
    label: "githubDark"
  });

  

  const handleChangeLanguage = (selectedOption: any) => {
    setSelectedLanguage(selectedOption);
    setCurrentLanguage(selectedOption.value);
    setCurrentCode(languageMap[selectedOption.value].defaultCode);
  };

  const handleChangeTheme = (selectedOption: any) => {
    setSelectedTheme(selectedOption);
  };

   const getFile = (e: any) => {
     const input = e.target; 
      // input ={
      //   files : ["file1.txt", "file2.txt"...]
      // }

     if("files" in input && input.files.length > 0){
       placeFileContent(input.files[0]);
     }
   }
  const placeFileContent =(file: any) =>{
      readFileContent(file).then((content) =>{
         setCurrentCode(content as string)
      })
      .catch((error) =>console.log(error));
  };

  function readFileContent(file: any) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (event) => resolve(event!.target!.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  //  Export function
  const handleExport = () =>{
    const blob = new Blob([currentCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = "New-Document.txt";
    link.href = url;
    link.click();

  }

  // full Screen
  // const handle = useFullScreenHandle();
  const handleFullScreen = ()=>{
    document.body.requestFullscreen();
  }
  
  return (
    <StyledEditorContainer>
      {/* Upper Toolbar Begins */}
      <UpperToolbar>
        <Title>
          <h3>{title}</h3>
          <button onClick={() =>{
            // oen a modal to do edit card title
            openModal({
              value: true,
              type: "1",
              identifer: {
                folderId: folderId,
                cardId: cardId

              }
            })
          }}>
            <BiEditAlt />
          </button>
        </Title>
        <SelectBars>
        <SaveCode onClick={()=>{
           saveCode();
        }}>Save Code</SaveCode>
          <Select
            value={selectedLanguage}
            options={languageOptions}
            onChange={handleChangeLanguage}
          />
          <Select
            value={selectedTheme}
            options={themeOptions}
            onChange={handleChangeTheme}
          />
        </SelectBars>
      </UpperToolbar>
      {/* Upper Toolbar Ends */}

      {/* Code Editor Begins */}
      < CodeEditor
        currentLanguage={selectedLanguage.value}
        currentTheme={selectedTheme.value}
        currentCode={currentCode}
        setCurrentCode={setCurrentCode}
        />
      {/* Code Editor Ends */}

      {/* Lower Toolbar Begins */}
      <LowerToolbar>
        <ButtonGroup>
         <button onClick={handleFullScreen}>
            <BiFullscreen />
            Full Screen
            </button> 
            {/* <FullScreen handle={handle}>
            < CodeEditor
        currentLanguage={selectedLanguage.value}
        currentTheme={selectedTheme.value}
        currentCode={currentCode}
        setCurrentCode={setCurrentCode}
        />
      </FullScreen> */}
      
          <label>
            <input type='file' 
            accept=".txt" 
            style={{display: "none"}} 
            onChange={(e) =>{
              getFile(e);
            }} />
            <BiImport /> Import Code
          </label>
          <button onClick={handleExport}>
            <BiExport />
            Export Code
          </button> 
        </ButtonGroup>
        <RunCode onClick={() =>{
           runCode();
        }}>Run Code</RunCode>
      </LowerToolbar>
      {/* Lower Toolbar Ends */}
    </StyledEditorContainer>
  );
};

export default EditorContainer;