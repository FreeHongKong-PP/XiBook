import React, { useState, useEffect, useRef, createContext } from "react";
import axios from 'axios';
import ImageUploader from 'react-images-upload';
import Switch from "react-switch";
import { Button, Icon } from 'semantic-ui-react'
import './App.css';

function App() {
  const [image, setImage] = useState(null)
  const canvas = useRef(null)
  const [authorText, setauthorText] = useState('习维尼')
  const [titleText, settitleText] = useState('谈敗国暴政')
  const [journalText,setjournalText] = useState('第六四卷')
  const [authorPicture, setauthorPicture] = useState(null)
  const [pictures, setPictures] = useState([]);
  
  const onDrop = (picture,file) => {
    console.log(picture)
    console.log(file)
    let uploadedImgBase64 = new Image();
    uploadedImgBase64.onload = () => setauthorPicture(uploadedImgBase64)
    uploadedImgBase64.src = file[0]
    // setPictures([picture]);
  };  

  useEffect(() => {
    const xiBookImageTemplate = new Image();
    xiBookImageTemplate.onload = () => setImage(xiBookImageTemplate)
    xiBookImageTemplate.src = "/images/XiBook_Template.jpg" 
  }, [])

  useEffect(() => {
    if (image && canvas) {
      const ctx = canvas.current.getContext("2d")
      ctx.setTransform (1, 0, 0, 1, 0, 0);
      ctx.drawImage(image,0,0)      
      ctx.fillStyle = "#fffff7"
      //Book Vertical Bar
      ctx.fillRect(160, 230, 200, 245)
      ctx.setTransform (1, -0.2, 0, 1, 0.2, 0);
      ctx.fillStyle = "#d4d4ca"
      ctx.fillRect(126,30,27,300)
      ctx.setTransform (1, 0.3, 0, 1, 0, 0);
      ctx.fillStyle = "#d4d4ca"    
      ctx.fillRect(126,225,27,135)

      //
      ctx.fillStyle = "#a60203"
      let b = - 0.1;
      let spineX =  295 ; 
      let spineYStart = 85;

      //Author Text 
      let authorTextCount = authorText.length;
      let authorTextStep = Math.round((190-spineYStart)/authorTextCount);
      let authorTextfontSize = authorTextCount>4? 22 : authorTextCount<3? 27 : 25;
      ctx.font = "800 "+authorTextfontSize+"px Noto Sans SC"
      for (let a of authorText){
        ctx.setTransform(0.45, b, 0, 1, 0, 0);
        ctx.fillText(a, spineX, spineYStart)
        spineYStart+=authorTextStep
        console.log('spineYStart:' + spineYStart)
        b+=0.01
      }

      let titleTextCount = titleText.length;
      let titleTextStep = Math.round((315-spineYStart+10)/titleTextCount);
      let titleTextfontSize = titleTextCount>8? 15 : titleTextCount<6? 18 : 17;

      spineYStart+=10
      ctx.font = "600 "+titleTextfontSize+"px Noto Sans SC"    
      for (let t of titleText){
        ctx.setTransform(0.45, b, 0, 1, 0, 0);
        ctx.fillText(t,spineX, spineYStart)
        spineYStart+=titleTextStep
        b+=0.01       
      }

      spineYStart+=8
      ctx.font = "100 13px Noto Sans SC"
      for (let j of journalText){
        ctx.setTransform(0.45, b, 0, 1, 0, 0);
        ctx.fillText(j,spineX, spineYStart)
        spineYStart+=5
        b+=0.05  
      }
      // ctx.fillText
      //Book Front Face
      ctx.fillStyle = "#cc021c"
      ctx.textAlign = "center"
      ctx.setTransform (1, -0.05, 0, 1, 0, 0);

      ctx.font = "600 27px Noto Sans SC"       
      ctx.fillText(chunk(authorText,1,' '), 280, 270)      

      ctx.font = "600 20px Noto Sans SC"
      ctx.fillText(chunk(titleText,1,'  '), 280, 305)

      ctx.font = "100 13px Noto Sans SC"
      ctx.fillText(chunk(journalText,1,' '), 280, 335)

      ctx.setTransform (1, 0, 0, 1, 0, 0);
      if(authorPicture) ctx.drawImage(authorPicture,0,0)
    }
  }, [image, authorPicture,canvas, authorText, titleText,journalText,pictures])
  
  function chunk(str, n, d) {
    const REGEX_CHINESE = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
    const hasChinese = str.match(REGEX_CHINESE);
    if(hasChinese) return str

    var ret = [];
    var i;
    var len;

    for(i = 0, len = str.length; i < len; i += n) {
       ret.push(str.substr(i, n))
    }
        
    return ret.join(d)
  };
 
  return (
    <div className="vertical-center">
      <h1 style={{
        backgroundColor :'red',
        color :'yellow'
      }}>談治國理政封面生成器</h1>
      <div>
        <canvas
          ref={canvas}
          width={512}
          height={407}
        />
      </div>
      <div>
      <ImageUploader
                withIcon={true}
                buttonText='上傳作者頭像'
                onChange={onDrop}
                imgExtension={['.jpg', '.jpeg', '.png','.webp']}
                label='最大檔案格式為5mb, 可上傳格式 .jpg, .jpeg, .png, .webp' 
                singleImage={true}
                maxFileSize={5242880}
                name="upload"
                fileTypeError='不是支援的檔案格式'
                defaultImages={['/images/Xi.jpg']}
            />
        <br/>
        作者 :   
        <input type="text"
          value={authorText}
          maxLength={6}
          onChange={e => setauthorText(e.target.value)}
        />
        <br />
        書名 :   
        <input type="text"
          value={titleText}
          maxLength={10}
          onChange={e => settitleText(e.target.value)}
        />
        <br />
        卷數 :  
        <input type="text"
          value={journalText}
          maxLength={4}
          onChange={e => setjournalText(e.target.value)}
        />
      </div>
    <br />
    <h4>談治國理政封面生成器由<Button size='mini' color='twitter' href='https://twitter.com/MasterOfNMSLese'>
        <Icon name='twitter'/>@MasterOfNMSLese</Button>
      製作</h4>
    </div>
  )
}

export default App;
