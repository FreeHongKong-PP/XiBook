import React, { useState, useCallback, useRef, useEffect} from "react";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button, Icon,Input,Form, Grid, Container,Header } from 'semantic-ui-react'
import './App.css';

function chunk(str, n, d) {
  const REGEX_CHINESE = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
  const hasChinese = str.match(REGEX_CHINESE);
  if(hasChinese) return str

  let ret = [];
  let i;
  let len;

  for(i = 0, len = str.length; i < len; i += n) {
     ret.push(str.substr(i, n))
  }
      
  return ret.join(d)
};

function generateDownload(canvas) {
  canvas.toBlob(
    blob => {
      const previewUrl = window.URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.download = "XiBook.png";
      anchor.href = URL.createObjectURL(blob);
      anchor.click();

      window.URL.revokeObjectURL(previewUrl);
    },
    "image/png",
    1
  );
}


function App() {
  const [upImg, setUpImg] = useState();
  const imgRef = useRef(null);
  const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 3 / 4 });
  const [completedCrop, setCompletedCrop] = useState(null);

  const [image, setImage] = useState(null)
  const canvas = useRef(null)
  const [authorText, setauthorText] = useState('习近平')
  const [titleText, settitleText] = useState('谈治国理政')
  const [journalText,setjournalText] = useState('第三卷')
  
  const onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback(img => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    const xiBookImageTemplate = new Image();
    xiBookImageTemplate.onload = () => setImage(xiBookImageTemplate)
    xiBookImageTemplate.src = "/images/XiBook_Template.jpg" 
  }, [])

  useEffect(() => {
    if (image && canvas) {
      const ctx = canvas.current.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = "none";
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
      let spineX =  305 ; 
      let spineYStart = 85;
      ctx.textAlign = "center"
      //Author Text 
      let authorTextCount = authorText.length;
      let authorTextStep = Math.round((190-spineYStart)/authorTextCount);
      let authorTextfontSize = authorTextCount>4? 22 : authorTextCount<3? 27 : 25;
      ctx.font = "800 "+authorTextfontSize+"px Noto Sans SC"
      for (let a of authorText){
        ctx.setTransform(0.45, b, 0, 1, 0, 0);
        ctx.fillText(a, spineX, spineYStart)
        spineYStart+=authorTextStep
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

      let journalTextCount = journalText.length;
      let jouralTextStep = Math.round((340-spineYStart+8)/journalTextCount);
      let journalTextfontSize = journalTextCount>3?11:journalTextCount<3?15:13;
      spineYStart+=8
      ctx.font = "100 "+journalTextfontSize+"px Noto Sans SC"
      for (let j of journalText){
        ctx.setTransform(0.45, b, 0, 1, 0, 0);
        ctx.fillText(j,spineX, spineYStart)
        spineYStart+=jouralTextStep
        b+=0.05  
      }
      
      // ctx.fillText
      //Book Front Face
      ctx.fillStyle = "#cc021c"
      ctx.setTransform (1, -0.05, 0, 1, 0, 0);

      ctx.font = "600 27px Noto Sans SC"       
      ctx.fillText(chunk(authorText,1,' '), 280, 270)      

      ctx.font = "600 20px Noto Sans SC"
      ctx.fillText(chunk(titleText,1,'  '), 280, 305)

      ctx.font = "100 13px Noto Sans SC"
      ctx.fillText(chunk(journalText,1,' '), 280, 335)

      // ctx.setTransform (1, 0, 0, 1, 0, 0);
      // if(authorPicture) ctx.drawImage(authorPicture,0,0)
      // ctx.fillStyle = '#fffff7';
      // ctx.fillRect(225, 50, 120, 150);
      // clipArc(ctx, 280, 115, 120, 40);
      if (!completedCrop  || !imgRef.current) {
        return;
      }
      const imageCurrentRef = imgRef.current;
      const crop = completedCrop;
  
      const scaleX = imageCurrentRef.naturalWidth / imageCurrentRef.width;
      const scaleY = imageCurrentRef.naturalHeight / imageCurrentRef.height;
      ctx.drawImage(
        imageCurrentRef,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        225,
        70,
        120,
        160
      );   
    }



  }, [image,canvas, authorText, titleText,journalText,crop,completedCrop,imgRef])

  return (
    <Container textAlign='center'>

        <Header as='h1' style={{
        backgroundColor :'red',
        color :'yellow'
        }}>談治國理政封面生成器</Header>
      <Button
        onClick={() =>
          generateDownload(canvas.current, completedCrop)
        }
      >下載談治國論政封面</Button>
      <Grid columns={2} stackable>
      <Grid.Row>
      <Grid.Column>
        <canvas
          ref={canvas}
          width={512}
          height={407}
        />
        </Grid.Column>
        <Grid.Column>
        <ReactCrop
          src={upImg}
          onImageLoaded={onLoad}
          crop={crop}
          onChange={c => setCrop(c)}
          onComplete={c => setCompletedCrop(c)}
      />
        </Grid.Column>
        </Grid.Row>
      </Grid>
      <Form>
        <Form.Field>
          <label>作者</label>
          <Input 
            type="text"
            value={authorText}
            maxLength={6}
            onChange={e => setauthorText(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>書名</label>
          <Input 
            type="text"
            value={titleText}
            maxLength={10}
            onChange={e => settitleText(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>卷數</label>
          <Input type="text"
              value={journalText}
              maxLength={4}
              onChange={e => setjournalText(e.target.value)}
            />
        </Form.Field>
        <Form.Field>
          <label>上傳作者圖片</label>
          <Input type="file" accept="image/*" onChange={onSelectFile} />
        </Form.Field>
      </Form>
    <br />
    <h4>談治國理政封面生成器由<Button size='mini' color='twitter' href='https://twitter.com/MasterOfNMSLese'>
        <Icon name='twitter'/>@MasterOfNMSLese</Button>
      製作</h4>      
    </Container>    
  )
}

export default App;
