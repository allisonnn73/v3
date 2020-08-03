const sql = require('mssql');
const fs = require(`fs`);
const router = require('express').Router();
const {promisify} = require(`util`);
const session     =   require('express-session');
//const path = require(`path`);
//const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const readfile = promisify(fs.readFile);
const bodyParser = require('body-parser');
const Client = require('ssh2-sftp-client');
const path = require('path');
const sharp = require('sharp');
const nodemailer = require('nodemailer');
const multer  = require("multer");

router.use(bodyParser());
const config = {
  user: 'sa',
  password: '1',
  server: '192.168.2.174', // You can use 'localhost\\instance' to connect to named instance
  database: 'Shtats18',
  port: 1111,
};

let writeLog = (text) => {
  fs.writeFile("nlog.txt", text , err => {
    if (err) console.log (`Не удалось: ${err}`);
  })
};

//const upload = multer({dest:"uploads"});
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) =>{
      cb(null, "uploads");
  },
  filename: (req, file, cb) =>{
      cb(null, file.originalname);
  }
});
const upload = multer({storage:storageConfig})
//const archivecode=1;
//let rootfolder = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
//let rootfolder = `L:/Arhive/Scans/Documents/CIAM/01-0179-0020-01934а/`;
//let rootfolder = `Z:/01-0002-0003-000013/`;
// let rootfolder = `\\\\192.168.1.12\\media\\01-0002-0003-000013\\`;
//let rootfolder = `\\\\192.168.1.12\\media\\`;
//router.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
//================================== EmpsCadr ===================================
router.post('/uploadFile', upload.single("file"), (req, res, next) => {
  //console.log(req);
  
  let filedata = req.file;
    if(!filedata)
        res.send("Ошибка при загрузке файла");
    else
        res.send("1");
 

})

router.post('/SendMail', async (req, res) => {
  try {
    // let transport = nodemailer.createTransport({
    //   host: "olimp.sovetnik.info",
    //   port: 25,
    //   auth: {
    //     user: "niknik",
    //     pass: "Ni99xxx"
    //   }
    // });
    let transport = nodemailer.createTransport({
        host: "mail.nic.ru",
        port: 25,
        auth: {
          user: "niknik@tsovetnik.ru",
          pass: "Niknik99xxx"
        }
      });
    
    // let mailOptions = {
    //   from: '"Кочинев Николай" <niknik@tsovetnik.ru>',
    //   to: 'allisonn@mail.ru',
    //   subject: 'Проверка связи',
    //   text: 'Привет! Проверка. ',
    //   html: '<b>Привет!</b><br> Проверка <br />',
     
    // };
    let mailOptions = {
      from: '"Кочинев Николай" <niknik@tsovetnik.ru>',
      to:  req.body.Email,
      subject:  req.body.HeaderEmail,
      text:  req.body.BodyEmail,
      // attachments: [
      
      // {   // binary buffer as an attachment
      //   path: './uploads/'+ req.body.fileNameUpload,
      // },] 

    };
    
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });
    
    res.send(`1`);
     } 
  catch (error) {
    console.log(error);
  }
});

router.post('/loadEmps_and_EmpInfo_nnk', async (req, res) => {
  try {
     // const WorkDate = req.body.WorkDate;
      const OrgCode = req.body.OrgCode;
      console.log(OrgCode + `---`);
      let result;
      await sql.connect(config);
      
      //let SqlQuery = `SELECT EmpID, EmpKod,FIO, FDate from Emps where OrgCode = ${OrgCode} 
      //        and FDate IS NULL order by FIO`;     
      let SqlQuery = `SELECT E.EmpID, E.EmpKod as mEmpKod, E.FIO, E.FDate, I.Email, I.EmpKod from Emps E, EmpInfo I where E.OrgCode = ${OrgCode} and E.EmpKod = I.EmpKod
              order by FIO`;     
      
      console.log(SqlQuery);
      
      result = await sql.query(SqlQuery);
      res.setHeader(`content-type`, `text/plain`);
      //sql.close();
    //  console.log(result);
      res.send(result);
     } 
  catch (error) {
    console.log(error);
  }
});

router.post('/addEmpsInfoReact_nnk', async (req, res) => {
  try {
      // const WorkDate = req.body.WorkDate;
      // const OrgCode = req.body.OrgCode;
      //const mEmpKod = req.body.EmpKod;
      //console.log(`EmpKod=  ` + mEmpKod);
      const mFam = req.body.Fam;
      const mIm = req.body.Im;
      const mOt = req.body.Ot; 
      const mBirthday = req.body.Birthday;
      const mPriemDate = req.body.PriemDate;
      const mPriemDol = req.body.PriemDol;
      const mWorkTel = req.body.WorkTel;
      const mLocalTel = req.body.LocalTel;
      const mEmail = req.body.Email; 
      let SqlQuery1; 
      let SqlQuery;
      let result;
      let result1;
      await sql.connect(config);
      SqlQuery1 = `Select max(EmpInfoID) as code from EmpInfo`;

      result1 = await sql.query(SqlQuery1);
      let EmpId = result1.recordset[0].code + 1;
      console.log(`Новый код  ` + EmpId);
      // SqlQuery = `Insert EmpInfo (EmpID,_Fam, _Im,_Ot,Email,Birthday,PriemDate,PriemDol,WorkTel,LocalTel) 
      //     values('${EmpId}','${mFam}','${mIm}','${mOt}','${mEmail}','${mBirthday}','${mPriemDate}','${mPriemDol}','${mWorkTel}','${mLocalTel})`;
      // console.log(SqlQuery);
      // result = await sql.query(SqlQuery);
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(`1`);
     } 
  catch (error) {
    console.log(error);
  }
});

router.post('/delEmpsInfoReact_nnk', async (req, res) => {
  try {
        // const WorkDate = req.body.WorkDate;
        // const OrgCode = req.body.OrgCode;
        const mEmpKod = req.body.EmpKod;
        console.log(`EmpKod=  ` + mEmpKod);
        let SqlQuery;
        SqlQuery = `Delete from EmpInfo where EmpKod = ${mEmpKod}`;
        console.log(SqlQuery);
        let result;
        await sql.connect(config);
        result = await sql.query(SqlQuery);
        //console.log(result);
        res.setHeader(`content-type`, `text/plain`);
        sql.close();
        res.send(`1`);
     } 
  catch (error) {
    console.log(error);
  }
});

router.post('/editEmpsInfoReact', async (req, res) => {
  try {
    // const WorkDate = req.body.WorkDate;
    // const OrgCode = req.body.OrgCode;
    const mEmpKod = req.body.EmpKod;
    console.log(`признак ` + mEmpKod);
    const mFam = req.body.Fam;
    const mIm = req.body.Im;
    const mOt = req.body.Ot; 
    const mBirthday = req.body.Birthday;
    const mPriemDate = req.body.PriemDate;
    const mPriemDol = req.body.PriemDol;
    const mWorkTel = req.body.WorkTel;
    const mLocalTel = req.body.LocalTel;
    const mEmail = req.body.Email; 
    let SqlQuery;
    // SqlQuery = `Update EmpInfo set _Fam='${mFam}', _Im='${mIm}', 
    // _Ot='${mOt}',Birthday='${mBirthday}',PriemDate=${mPriemDate}, 
    // PriemDol='${mPriemDol}', 
    // WorkTel='${mWorkTel}',LocalTel='${mLocalTel}',Email='${mEmail}'
    // where EmpKod = ${EmpKod}`;
    SqlQuery = `Update EmpInfo set _Fam='${mFam}', _Im='${mIm}', 
    _Ot='${mOt}',Email='${mEmail}',Birthday='${mBirthday}',PriemDate='${mPriemDate}',PriemDol='${mPriemDol}',WorkTel='${mWorkTel}',LocalTel='${mLocalTel}'
    where EmpKod = ${mEmpKod}`;
                         
     console.log(SqlQuery);

      let result;
      await sql.connect(config);

      result = await sql.query(SqlQuery);
      //console.log(result);
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(`1`);
     } 
  catch (error) {
    console.log(error);
  }
  
});


router.post('/loademps_nnk', async (req, res) => {
  try {
      
     // const WorkDate = req.body.WorkDate;
      const OrgCode = req.body.OrgCode;
    
     console.log(OrgCode + `---`);
      let result;
      let jobcatcode;
      await sql.connect(config);
      
      //let SqlQuery = `SELECT EmpID, EmpKod,FIO, FDate from Emps where OrgCode = ${OrgCode} 
      //        and FDate IS NULL order by FIO`;     
      let SqlQuery = `SELECT EmpID, EmpKod,FIO, FDate from Emps where OrgCode = ${OrgCode} 
              order by FIO`;     
      
      console.log(SqlQuery);
      
      result = await sql.query(SqlQuery);
      res.setHeader(`content-type`, `text/plain`);
      //sql.close();
    //  console.log(result);
      res.send(result);
     } 
  catch (error) {
    console.log(error);
  }
  
});

router.get('/loadempsphoto1', async (req, res) => {
  try {
       // const WorkDate = req.body.WorkDate;
      //const EmpKod = req.body.EmpKod;
      const EmpKod = req.query.EmpKod;
      console.log(EmpKod + `---`);
      let result;
      await sql.connect(config);
      //let SqlQuery = `select Photo from EmpInfo where EmpKod =  3001`; 
      let SqlQuery = `select Photo from EmpInfo where EmpKod =  ${EmpKod}`;     
      console.log(SqlQuery);
      result = await sql.query(SqlQuery);
      //let result1 = JSON.stringify(result);
      if (result.recordset[0].Photo !== null) {
        let base64Image = result.recordset[0].Photo.toString('base64');
        let decodedImage = new Buffer(base64Image, 'base64');
          //let base64Image = new Buffer(result.recordset[0].Photo, 'binary').toString('base64');
          //let base64Image = new Buffer(result.recordset[0].Photo).toString('utf8');
          //let decodedImage = new Buffer(base64Image, 'base64');
         // fs.writeFile('image_decoded3.jpg', decodedImage, function(err) {});
          res.setHeader(`content-type`, `image/jpg`);
          //sql.close();
          console.log(`Есть фото`);
          res.send(decodedImage);
      }
     else {
      fs.readFile(`routes/nofot.jpg`, 
      function(error,data){
          console.log(`Нет фото`);
         // console.log("Асинхронное чтение файла");
          if(error) throw error; // если возникла ошибка
          //console.log(data);  // выводим считанные данные
          res.setHeader(`content-type`, `image/jpg`);
          res.send(data);
      }); 
      
      //  res.setHeader(`content-type`, `text/plain`);
      //  res.send(`1`);
      //res.sendStatus(`404`);
      //sql.close();
      // console.log(`Нет фото`);
      // let sendImage = "data:image/html;base64,PHN2ZyB3aWR0aD0iNTgwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDwhLS0gQ3JlYXRlZCB3aXRoIFNWRyBFZGl0b3IgLSBodHRwOi8vZ2l0aHViLmNvbS9temFsaXZlL1NWRyBFZGl0b3IvIC0tPgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9IiNmZmYiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSI0MDIiIHdpZHRoPSI1ODIiIHk9Ii0xIiB4PSItMSIvPgogIDxnIGRpc3BsYXk9Im5vbmUiIG92ZXJmbG93PSJ2aXNpYmxlIiB5PSIwIiB4PSIwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIiBpZD0iY2FudmFzR3JpZCI+CiAgIDxyZWN0IGZpbGw9InVybCgjZ3JpZHBhdHRlcm4pIiBzdHJva2Utd2lkdGg9IjAiIHk9IjAiIHg9IjAiIGhlaWdodD0iMTAwJSIgd2lkdGg9IjEwMCUiLz4KICA8L2c+CiA8L2c+CiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPHRleHQgZm9udC13ZWlnaHQ9ImJvbGQiIHhtbDpzcGFjZT0icHJlc2VydmUiIHRleHQtYW5jaG9yPSJzdGFydCIgZm9udC1mYW1pbHk9IkhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNjYiIGlkPSJzdmdfMSIgeT0iMjIzIiB4PSIxMzkuMjU3ODEzIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzAwMDAwMCI+0J3QtdGCINGE0L7RgtC+PC90ZXh0PgogPC9nPgo8L3N2Zz4=";  
      // //sendImage = sendImage.toString('base64');
      // let decodedImage = new Buffer(sendImage, 'base64');    
      // res.setHeader(`content-type`, `image/jpg`);

      // res.send(decodedImage);
      //sql.close();
     }
     } 
  catch (error) {
    console.log(error);
  }
});

router.post('/loadempsinfo', async (req, res) => {
  try {
       // const WorkDate = req.body.WorkDate;
      const EmpKod = req.body.EmpKod;
      console.log(EmpKod + `---`);
      let result;
      await sql.connect(config);
      let SqlQuery = `select _Fam, _Im, _Ot, Birthday, PriemDate, PriemDol, WorkTel,
                      LocalTel, Email from EmpInfo where EmpKod = ${EmpKod}`;     
      console.log(SqlQuery);
      result = await sql.query(SqlQuery);
      res.setHeader(`content-type`, `text/plain`);
      //sql.close();
      console.log(result);
      res.send(result);
     } 
  catch (error) {
    console.log(error);
  }
});

//===================================Структура============================================

router.post('/loadjobname', async (req, res) => {
  try {
      
      const WorkDate = req.body.WorkDate;
      const OrgCode = req.body.OrgCode;
      const JobGrpCode = req.body.JobGrpCode;
     //console.log(OrgCode + `---` + depcode + `---` +sectorcode + `---` + divcode);
      let result;
      let jobcatcode;
      await sql.connect(config);
      
      let SqlQuery = `SELECT JobCode,JobName from sprJobs where JobGrpCode = ${JobGrpCode} 
      and OrgCode = ${OrgCode}
        order by JobCode`;     
      
      console.log(SqlQuery);
      
      result = await sql.query(SqlQuery);
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(result);
     } 
  catch (error) {
    console.log(error);
  }
  
});

router.post('/loadgrp2', async (req, res) => {
  try {
      
      const WorkDate = req.body.WorkDate;
      const OrgCode = req.body.OrgCode;
     //console.log(OrgCode + `---` + depcode + `---` +sectorcode + `---` + divcode);
      let result;
      let jobcatcode;
      await sql.connect(config);
      if (OrgCode==1) {
        jobcatcode = 11;
      } 
      else {jobcatcode = 12;}
      let SqlQuery = `SELECT JobGrpCode,JobGrpName from sprJobGrps where JobCategCode = ${jobcatcode}
        order by JobGrpCode`;     
      
      console.log(SqlQuery);
      
      result = await sql.query(SqlQuery);
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(result);
     } 
  catch (error) {
    console.log(error);
  }
  
});

router.post('/delAll', async (req, res) => {
  try {
    const WorkDate = req.body.WorkDate;
    const OrgCode = req.body.OrgCode;
    const priz1 = req.body.priz1;
    console.log(`признак ` + priz1);
    const code = req.body.mcode; 
    
    let SqlQuery;
    if (priz1 == 1) {
        SqlQuery = `Delete from sprDepts where OrgCode = ${OrgCode} and DeptCode = ${code}`;
        }
    
                          
     console.log(SqlQuery);

      let result;
      await sql.connect(config);

      result = await sql.query(SqlQuery);
      //console.log(result);
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(`1`);
     } 
  catch (error) {
    console.log(error);
  }
  
});



router.post('/addAll', async (req, res) => {
  try {
    const WorkDate = req.body.WorkDate;
    const OrgCode = req.body.OrgCode;
    const priz1 = req.body.priz1;
   
    // const code = req.body.mcode; 
    const name = req.body.mname;
    const bdate = req.body.mbdate;
    const fdate = req.body.mfdate; 
    const comm = req.body.mcomm;
    const deptcode = req.body.DeptCode;
    const sectorcode = req.body.SectorCode;
    const DivCode = req.body.DivCode;
    const JobCode = req.body.JobCode;
    const JobOklad = req.body.JobOklad;
    let SqlQuery1; 
    let SqlQuery;
    let result;
    let result1;
    console.log(`признак ` + deptcode);
    
    await sql.connect(config);
    
    if (priz1 == 1) {
      SqlQuery1 = `Select max(DeptCode) as code from sprDepts where OrgCode = ${OrgCode}`;

      result1 = await sql.query(SqlQuery1);
      let DeptCode = result1.recordset[0].code + 1;
      console.log(DeptCode);
        SqlQuery = `Insert sprDepts (OrgCode,DeptCode,DeptName,bdate,fdate,Comments) 
        values(${OrgCode},${DeptCode},'${name}','${bdate}',${fdate},'${comm}')`;
        await addDefaultSector(OrgCode,DeptCode,bdate,fdate,comm);
        await addDefaultDiv(OrgCode,DeptCode,bdate,fdate,comm);
        }
    if (priz1 == 2) {
          SqlQuery1 = `Select max(SectorCode) as code from sprSectors where OrgCode = ${OrgCode} and
          DeptCode = ${deptcode}`;
          console.log(deptcode);
          result1 = await sql.query(SqlQuery1);
          let SectorCode = result1.recordset[0].code + 1;
          console.log(SectorCode);
          SqlQuery = `Insert sprSectors (OrgCode,DeptCode,SectorCode,SectorName,bdate,fdate,Comments) 
          values(${OrgCode},${deptcode},${SectorCode},'${name}','${bdate}',${fdate},'${comm}')`;
          }
          
     if (priz1 == 3) {
            SqlQuery1 = `Select max(DivCode) as code from sprDivs where OrgCode = ${OrgCode} and
            DeptCode = ${deptcode} and SectorCode = ${sectorcode} `;
            console.log(sectorcode);
            result1 = await sql.query(SqlQuery1);
            let DivCode = result1.recordset[0].code + 1;
            console.log(DivCode);
            SqlQuery = `Insert sprDivs (OrgCode,DeptCode,SectorCode,DivCode,DivName,bdate,fdate,Comments) 
            values(${OrgCode},${deptcode},${sectorcode},${DivCode},'${name}','${bdate}',${fdate},'${comm}')`;
            } 
            
      if (priz1 == 4) {
              let UnitID = await updatesec(`Units`);
              SqlQuery1 = `Select max(UnitCode) as code from Units where OrgCode = ${OrgCode} and
              DeptCode = ${deptcode} and SectorCode = ${sectorcode} and DivCode = ${DivCode}`;
              console.log(sectorcode);
              result1 = await sql.query(SqlQuery1);
              let UnitCode = result1.recordset[0].code + 1;
              console.log(UnitCode);
              SqlQuery = `Insert Units (UnitID,OrgCode,DeptCode,SectorCode,DivCode,JobCode,JobOklad,
                bdate,fdate,Comments) 
              values(${UnitID},${OrgCode},${deptcode},${sectorcode},${DivCode},${JobCode},${JobOklad},'${bdate}',${fdate},'${comm}')`;
              }            
      console.log(SqlQuery);

      //await sql.connect(config);
      result = await sql.query(SqlQuery);
      //console.log(result);
      
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(`1`);
     } 
  catch (error) {
    console.log(error);
  }
  
});

router.post('/delAllReact', async (req, res) => {
  try {
    const WorkDate = req.body.WorkDate;
    const OrgCode = req.body.OrgCode;
    const priz1 = req.body.priz1;
    console.log(`признак ` + priz1);
    const code = req.body.mcode; 
    const SectorCode = req.body.SectorCode; 
    const DivCode = req.body.DivCode;
    const UnitID = req.body.UnitID;  

    let SqlQuery;
    if (priz1 == 0) {
        SqlQuery = `Delete from sprDepts where OrgCode = ${OrgCode} and DeptCode = ${code}`;
        }
    if (priz1 == 1) {
          SqlQuery = `Delete from sprSectors where OrgCode = ${OrgCode} and DeptCode = ${code} 
            and SectorCode = ${SectorCode}`;
          }
    if (priz1 == 2) {
          SqlQuery = `Delete from sprDivs where OrgCode = ${OrgCode} and DeptCode = ${code} 
            and SectorCode = ${SectorCode} and DivCode = ${DivCode}`;
            }
    if (priz1 == 3) {
           SqlQuery = `Delete from Units where UnitID = ${UnitID}`;
                }                  
                        
     console.log(SqlQuery);

      let result;
      await sql.connect(config);

      result = await sql.query(SqlQuery);
      //console.log(result);
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(`1`);
     } 
  catch (error) {
    console.log(error);
  }
  
});

router.post('/addAllReact', async (req, res) => {
  try {
    const WorkDate = req.body.WorkDate;
    const OrgCode = req.body.OrgCode;
    const priz1 = req.body.priz1;
   
    // const code = req.body.mcode; 
    const name = req.body.mname;
    const bdate = req.body.mbdate;
    const fdate = req.body.mfdate; 
    const comm = req.body.mcomm;
    const deptcode = req.body.DeptCode;
    const sectorcode = req.body.SectorCode;
    const DivCode = req.body.DivCode;
    const JobCode = req.body.JobCode;
    const JobOklad = req.body.JobOklad;
    let SqlQuery1; 
    let SqlQuery;
    let result;
    let result1;
    console.log(`признак ` + deptcode);
    
    await sql.connect(config);
    
    if (priz1 == 0) {
      SqlQuery1 = `Select max(DeptCode) as code from sprDepts where OrgCode = ${OrgCode}`;

      result1 = await sql.query(SqlQuery1);
      let DeptCode = result1.recordset[0].code + 1;
      console.log(DeptCode);
        SqlQuery = `Insert sprDepts (OrgCode,DeptCode,DeptName,bdate,fdate,Comments) 
        values(${OrgCode},${DeptCode},'${name}','${bdate}',${fdate},'${comm}')`;
        await addDefaultSector(OrgCode,DeptCode,bdate,fdate,comm);
        await addDefaultDiv(OrgCode,DeptCode,bdate,fdate,comm);
        }
    if (priz1 == 1) {
          SqlQuery1 = `Select max(SectorCode) as code from sprSectors where OrgCode = ${OrgCode} and
          DeptCode = ${deptcode}`;
          console.log(deptcode);
          result1 = await sql.query(SqlQuery1);
          let SectorCode = result1.recordset[0].code + 1;
          console.log(SectorCode);
          SqlQuery = `Insert sprSectors (OrgCode,DeptCode,SectorCode,SectorName,bdate,fdate,Comments) 
          values(${OrgCode},${deptcode},${SectorCode},'${name}','${bdate}',${fdate},'${comm}')`;
          }
          
     if (priz1 == 2) {
            SqlQuery1 = `Select max(DivCode) as code from sprDivs where OrgCode = ${OrgCode} and
            DeptCode = ${deptcode} and SectorCode = ${sectorcode} `;
            console.log(sectorcode);
            result1 = await sql.query(SqlQuery1);
            let DivCode = result1.recordset[0].code + 1;
            console.log(DivCode);
            SqlQuery = `Insert sprDivs (OrgCode,DeptCode,SectorCode,DivCode,DivName,bdate,fdate,Comments) 
            values(${OrgCode},${deptcode},${sectorcode},${DivCode},'${name}','${bdate}',${fdate},'${comm}')`;
            } 
            
      if (priz1 == 3) {
              let UnitID = await updatesec(`Units`);
              SqlQuery1 = `Select max(UnitCode) as code from Units where OrgCode = ${OrgCode} and
              DeptCode = ${deptcode} and SectorCode = ${sectorcode} and DivCode = ${DivCode}`;
              console.log(sectorcode);
              result1 = await sql.query(SqlQuery1);
              let UnitCode = result1.recordset[0].code + 1;
              console.log(UnitCode);
              SqlQuery = `Insert Units (UnitID,OrgCode,DeptCode,SectorCode,DivCode,JobCode,JobOklad,
                bdate,fdate,Comments) 
              values(${UnitID},${OrgCode},${deptcode},${sectorcode},${DivCode},${JobCode},${JobOklad},'${bdate}',${fdate},'${comm}')`;
              }            
      console.log(SqlQuery);

      //await sql.connect(config);
      result = await sql.query(SqlQuery);
      //console.log(result);
      
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(`1`);
     } 
  catch (error) {
    console.log(error);
  }
  
});

router.post('/editAllReact', async (req, res) => {
  try {
    const WorkDate = req.body.WorkDate;
    const OrgCode = req.body.OrgCode;
    const priz1 = req.body.priz1;
    console.log(`признак ` + priz1);
    const DeptCode = req.body.DeptCode;
    const SectorCode = req.body.SectorCode;
    const DivCode = req.body.DivCode; 
    const UnitID = req.body.UnitID;
    const JobOklad = req.body.JobOklad;
    const JobCode = req.body.JobCode;
    const name = req.body.mname;
    const bdate = req.body.mbdate;
    const fdate = req.body.mfdate; 
    const comm = req.body.mcomm;
    
    let SqlQuery;
    if (priz1 == 0) {
        SqlQuery = `Update sprDepts set DeptName='${name}', bdate='${bdate}', fdate=${fdate},
        Comments='${comm}' where OrgCode = ${OrgCode} and DeptCode = ${DeptCode}`;
        }
     
    if (priz1 == 1) {
          SqlQuery = `Update sprSectors set SectorName='${name}', bdate='${bdate}', fdate=${fdate},
          Comments='${comm}' where OrgCode = ${OrgCode} and DeptCode = ${DeptCode} 
          and SectorCode = ${SectorCode}`;
          }

    if (priz1 == 2) {
            SqlQuery = `Update sprDivs set DivName='${name}', bdate='${bdate}', fdate=${fdate},
            Comments='${comm}' where OrgCode = ${OrgCode} and DeptCode = ${DeptCode} 
            and SectorCode = ${SectorCode} and DivCode = ${DivCode}`;
            }       

    if (priz1 == 3) {
            SqlQuery = `Update Units set bdate='${bdate}', fdate=${fdate},
            Comments='${comm}',JobOklad = ${JobOklad},JobCode =  ${JobCode} where UnitID = ${UnitID}`;
            }         
                         
     console.log(SqlQuery);

      let result;
      await sql.connect(config);

      result = await sql.query(SqlQuery);
      //console.log(result);
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(`1`);
     } 
  catch (error) {
    console.log(error);
  }
  
});

router.post('/editAll', async (req, res) => {
  try {
    const WorkDate = req.body.WorkDate;
    const OrgCode = req.body.OrgCode;
    const priz1 = req.body.priz1;
    console.log(`признак ` + priz1);
    const DeptCode = req.body.DeptCode; 
    const name = req.body.mname;
    const bdate = req.body.mbdate;
    const fdate = req.body.mfdate; 
    const comm = req.body.mcomm;
    const SectorCode = req.body.SectorCode; 
    const ShtatUnits = req.body.ShtatUnits;
    const JobOklad = req.body.JobOklad;
    let SqlQuery;
    if (priz1 == 1) {
        SqlQuery = `Update sprDepts set DeptName='${name}', bdate='${bdate}', fdate=${fdate},
        Comments='${comm}' where OrgCode = ${OrgCode} and DeptCode = ${DeptCode}`;
        }
     
    if (priz1 == 2) {
          SqlQuery = `Update sprSectors set SectorName='${name}', bdate='${bdate}', fdate=${fdate},
          Comments='${comm}' where OrgCode = ${OrgCode} and DeptCode = ${DeptCode} 
          and SectorCode = ${SectorCode}`;
          } 

    if (priz1 == 4) {
            SqlQuery = `Update Units set bdate='${bdate}', fdate=${fdate},
            Comments='${comm}',JobOklad = ${JobOklad} where JobCode = ${ShtatUnits}`;
            }         
          
    
                          
     console.log(SqlQuery);

      let result;
      await sql.connect(config);

      result = await sql.query(SqlQuery);
      //console.log(result);
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(`1`);
     } 
  catch (error) {
    console.log(error);
  }
  
});

router.post('/loadUnitsReact', async (req, res) => {
  try {
      
      const WorkDate = req.body.WorkDate;
      const OrgCode = req.body.OrgCode;
      const depcode = req.body.depcode;
      const sectorcode = req.body.sectorcode; 
      const divcode = req.body.divcode;          
     console.log(OrgCode + `---` + depcode + `---` +sectorcode + `---` + divcode);

      let result;
      await sql.connect(config);
            
      let SqlQuery = `SELECT U.JobCode as code,J.Jobname as name,U.bDate,U.fDate,U.Comments,
      U.JobOklad, U.UnitID 
      from Units U, sprJobs J 
      where U.OrgCode = ${OrgCode} and U.deptcode = ${depcode} and U.sectorcode = ${sectorcode} 
      and U.divcode = ${divcode} and U.Jobcode = J.Jobcode
      order by U.JobCode`;
      console.log(SqlQuery);
      
      result = await sql.query(SqlQuery);
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(result);
     } 
  catch (error) {
    console.log(error);
  }
  
});


router.post('/loadUnits', async (req, res) => {
  try {
      
      const WorkDate = req.body.WorkDate;
      const OrgCode = req.body.OrgCode;
      const depcode = req.body.depcode;
      const sectorcode = req.body.sectorcode; 
      const divcode = req.body.divcode;          
     console.log(OrgCode + `---` + depcode + `---` +sectorcode + `---` + divcode);

      let result;
      await sql.connect(config);
            
      let SqlQuery = `SELECT U.JobCode as code,J.Jobname as name,U.bDate,U.fDate,U.Comments,U.JobOklad 
      from Units U, sprJobs J 
      where U.OrgCode = ${OrgCode} and U.deptcode = ${depcode} and U.sectorcode = ${sectorcode} 
      and U.divcode = ${divcode} and U.Jobcode = J.Jobcode
      order by U.JobCode`;
      console.log(SqlQuery);
      
      result = await sql.query(SqlQuery);
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(result);
     } 
  catch (error) {
    console.log(error);
  }
  
});

router.post('/loadDivs', async (req, res) => {
  try {
      
      const WorkDate = req.body.WorkDate;
      const OrgCode = req.body.OrgCode;
      const depcode = req.body.depcode;
      const sectorcode = req.body.sectorcode;           
     console.log(OrgCode + `---` + depcode + `---` +sectorcode);

      let result;
      await sql.connect(config);
            
      let SqlQuery = `SELECT DivCode as code,DivName as name,bDate,fDate,Comments from sprDivs 
      where OrgCode = ${OrgCode} and deptcode = ${depcode} and sectorcode = ${sectorcode} 
      order by DivCode`;
      console.log(SqlQuery);
      
      result = await sql.query(SqlQuery);
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(result);
     } 
  catch (error) {
    console.log(error);
  }
  
});

router.post('/loadSectors', async (req, res) => {
  try {
      
      const WorkDate = req.body.WorkDate;
      const OrgCode = req.body.OrgCode;
      const depcode = req.body.depcode;           
     console.log(OrgCode + `---` + depcode);

      let result;
      await sql.connect(config);
            
      let SqlQuery = `SELECT SectorCode as code,SectorName as name,bDate,fDate,Comments from sprSectors 
      where OrgCode = ${OrgCode} and deptcode = ${depcode} order by SectorCode`;
      console.log(SqlQuery);
      
      result = await sql.query(SqlQuery);
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(result);
     } 
  catch (error) {
    console.log(error);
  }
  
});

router.post('/loadDepts', async (req, res) => {
  try {
      
      const WorkDate = req.body.WorkDate;
      const OrgCode = req.body.OrgCode;
                 
     console.log(OrgCode + `---` + WorkDate);

      let result;
      await sql.connect(config);
            
      let SqlQuery = `SELECT DeptCode as code,DeptName as name,bDate,fDate,Comments from sprDepts 
      where OrgCode = ${OrgCode} order by DeptCode`;
      console.log(SqlQuery);
      
      result = await sql.query(SqlQuery);
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(result);
     } 
  catch (error) {
    console.log(error);
  }
  
});

router.post('/loadDeptsReact', async (req, res) => {
  try {
      
      // const WorkDate = req.body.WorkDate;
      const OrgCode = req.body.OrgCode;
                 
     console.log(`---` + OrgCode);

      let result;
      await sql.connect(config);
            
      let SqlQuery = `SELECT DeptCode as code,DeptName as name,bDate,fDate,Comments from sprDepts 
      where OrgCode = ${OrgCode} order by DeptCode`;
      console.log(SqlQuery);
      
      result = await sql.query(SqlQuery);
      res.setHeader(`content-type`, `application/json`);
      sql.close();
      res.send(result);
     } 
  catch (error) {
    console.log(error);
  }
  
});

router.post('/getOrgname', async (req, res) => {
  try {
      const body = req.body;
      let OrgCode = body.OrgCode;
      let result;
      await sql.connect(config);
      result = await sql.query(`SELECT OrgName FROM sprOrgs WHERE OrgCode= ${OrgCode}​`);
      //console.log(result);
      if (result.rowsAffected[0]!==0) {
          const OrgName = result.recordset[0].OrgName;
          console.log(OrgName);
          
          res.setHeader(`content-type`, `text/plain`);
          sql.close();
          res.send(OrgName.toString());
          
      }
      else {
        res.send(`-1`);
        
        sql.close();
        return;
      }
 
  } 
  catch (error) {
    console.log(error);
  }
}); 

//=====================Штатное Расписание==================================================================

router.post('/closeEmpRec', async (req, res) => {
  try {
      const ShtatID = req.body.ShtatID;
      const upDate = req.body.upDate;
      //console.log(ShtatID);
      let result;
      await sql.connect(config);
      let SqlQuery = `Update Shtats set fDate=${upDate} where ShtatID = ${ShtatID}`;
      console.log(SqlQuery);
      
      result = await sql.query(SqlQuery);
      //console.log(result);
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(`1`);
     } 
  catch (error) {
    console.log(error);
  }
  
});

router.post('/delete-shtat', async (req, res) => {
    try {
        const ShtatID = req.body.ShtatID;
        //console.log(ShtatID);
        let result;
        await sql.connect(config);
        let SqlQuery = `DELETE FROM Shtats where ShtatID = ${ShtatID}`;
        console.log(SqlQuery);
        
        result = await sql.query(SqlQuery);
        console.log(result);
        res.setHeader(`content-type`, `text/plain`);
        sql.close();
        res.send(result);
       } 
    catch (error) {
      console.log(error);
    }
    
  });

router.post('/add-shtats', async (req, res) => {
  try {
      
      let SqlQuery = req.body.sql1;
      //const empCode = req.body.empCode;
      //let qq = SqlQuery.toString();        
    // console.log(SqlQuery);
    
      let result;
      await sql.connect(config);
            
      //let SqlQuery = `SELECT OsnName, Nadb10 FROM sprOsn10 ORDER BY OsnKod`;
      //console.log(SqlQuery);

    //   let ShtatID = await nextsec(`Shtats`);

    //   console.log(`ШтатИД:` + ShtatID);

    //   SqlQuery.replace("XXXX",ShtatID);
    //   console.log(SqlQuery);

      result = await sql.query(SqlQuery);

      //console.log(result);
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(result);
     } 
  catch (error) {
    console.log(error);
  }
  
});

router.post('/update-shtats', async (req, res) => {
  try {
      
      const SqlQuery = req.body.sql1;
      //const empCode = req.body.empCode;
                 
     console.log(SqlQuery);

      let result;
      await sql.connect(config);
            
      //let SqlQuery = `SELECT OsnName, Nadb10 FROM sprOsn10 ORDER BY OsnKod`;
      //console.log(SqlQuery);
      
      result = await sql.query(SqlQuery);
      //console.log(result);
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(result);
     } 
  catch (error) {
    console.log(error);
  }
  
});

router.post('/get-updateseq', async (req, res) => {
    try {
        //const path1 = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
        const tablename = req.body.tablename;
        
       //console.log(tablename);
        let result;
        let SqlQuery;
        let SqlUpdate;
        let result1;
        await sql.connect(config);
        
        SqlQuery = `SELECT CurVal FROM AllSeq WHERE TableName ='${tablename}'`;
        
       // console.log(SqlQuery);
        result = await sql.query(SqlQuery);
        
        res.setHeader(`content-type`, `text/plain`);
        
        let curval = result.recordset[0].CurVal;
        let nextval = curval + 1;
        
        SqlUpdate = `UPDATE AllSeq SET CurVal = ${nextval} WHERE TableName = '${tablename}'`;
        result1 = await sql.query(SqlUpdate);
        
        res.send(result);
    } 
    catch (error) {
      console.log(error);
    }
  });


router.post('/loadchin', async (req, res) => {
  try {
      
      //const OrgCode = req.body.OrgCode;
      //const empCode = req.body.empCode;
                 
     //console.log(empCode);

      let result;
      await sql.connect(config);
            
      let SqlQuery = `SELECT OsnName, Nadb10 FROM sprOsn10 ORDER BY OsnKod`;
      //console.log(SqlQuery);
      
      result = await sql.query(SqlQuery);
      //console.log(result);
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(result);
     } 
  catch (error) {
    console.log(error);
  }
  
});

router.post('/post-empCard', async (req, res) => {
  try {
      
      const WorkDate = req.body.WorkDate;
      const empCode = req.body.empCode;
                 
     console.log(empCode + `---` + WorkDate);

      let result;
      await sql.connect(config);
            
      let SqlQuery = `SELECT S.ShtatID, S.UnitID, S.JobOklad,S.Bdate,S.Fdate,S.ProcOklad, S.Proc3, 
      S.Osn3, S.Proc4, S.Osn4, S.Proc8, S.Osn8, S.Proc9, 
      S.Osn9, S.Nadb10, S.Osn10, S.Nadb11, S.Osn11, S.Nadb12, S.Osn12, S.pSovm, S.pDecret, 
      S.pUvolen,S.pVrem,S.pOtpuskBS, S.pIO, S.Comments,  S.WriteDate,
      S.LogName,  U.DeptCode,D.DeptName,  U.SectorCode, U.DivCode,  U.JobCode, U.BDate UBDate, 
      U.FDate UFDate, U.Bdate JOBDate, U.Fdate JOFDate, E.FIO fio, Sec.SectorName SectorName, 
      Div.DivName DivName, J.JobName JobName  
      FROM Shtats S, Units U, sprDepts D, Emps E, sprSectors Sec, sprDivs Div, sprJobs J 
      WHERE U.UnitID =S.UnitID 
      AND S.EmpKod =${empCode} 
      
      and D.DeptCode=U.DeptCode
      and E.EmpKod = S.EmpKod
      and Sec.DeptCode = U.DeptCode
      and Sec.SectorCode = U.SectorCode
      and Div.DeptCode = U.DeptCode
      and Div.SectorCode = U.SectorCode
      and Div.DivCode = U.DivCode
      and J.JobCode = U.JobCode
      
      and E.BDate <= S.bdate AND (E.FDate >= S.FDate OR E.FDate IS NULL)
      Order By S.Bdate, S.Fdate`;
      console.log(SqlQuery);
      
      result = await sql.query(SqlQuery);
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(result);
     } 
  catch (error) {
    console.log(error);
  }
  
});

router.post('/login', async (req, res) => {
  try {
      const body = req.body;
      
      let login = body.login;
      let pass = body.pass;
      let result;
      await sql.connect(config);
      result = await sql.query(`SELECT OrgKod FROM Users WHERE LogName= '${login}' AND Pwd = '${pass}'​`);
      //console.log(result);
      if (result.rowsAffected[0]!==0) {
          const orgkod = result.recordset[0].OrgKod;
          console.log(orgkod);
          
          res.setHeader(`content-type`, `text/plain`);
          sql.close();
          res.send(orgkod.toString());
          
      }
      else {
        res.send(`-1`);
        
        sql.close();
        return;
      }
      //console.log(caid);
      //res.setHeader(`content-type`, `text/plain`);
      //sql.close();

  } 
  catch (error) {
    console.log(error);
  }
}); 

router.post('/post-shtats', async (req, res) => {
  try {
      
      const OrgCode = req.body.OrgCode;
      const WorkDate = req.body.WorkDate;
            
     console.log(OrgCode+`-`+WorkDate);

      let result;
      let SqlQueries= [];

      await sql.connect(config);
      // if (chFondName==`true`) {
      let SqlQuery1 = queryDept2(OrgCode,WorkDate);
      let SqlQuery2 = querySector2(OrgCode,WorkDate);
      let SqlQuery3 = queryDiv2(OrgCode,WorkDate);
      let SqlQuery4 = queryUnit2(OrgCode,WorkDate);
      let SqlQuery5 = queryEmp2(OrgCode,WorkDate);
      let SqlQuery6 = queryVac(OrgCode,WorkDate);

      SqlQuery = SqlQuery1 + ` UNION ` + SqlQuery2 + ` UNION ` + SqlQuery3 + ` UNION ` + SqlQuery4
       + ` UNION ` + SqlQuery5 + ` UNION ` + SqlQuery6 + ` order by deptCode,SectorCode,DivCode,UnitCode,pDept`;
      //console.log(SqlQuery);
      writeLog(SqlQuery);
      result = await sql.query(SqlQuery);
      
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(result);
     } 
  catch (error) {
    console.log(error);
  }
  
});

  router.post('/get-nextseq', async (req, res) => {
    try {
        //const path1 = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
        const tablename = req.body.tablename;
        
       console.log(tablename);
        let result;
        let SqlQuery;
        let SqlUpdate;
        let result1;
        await sql.connect(config);
        
        SqlQuery = `SELECT CurVal FROM AllSeq WHERE TableName ='${tablename}'`;
        
       // console.log(SqlQuery);
        result = await sql.query(SqlQuery);
        
        res.setHeader(`content-type`, `text/plain`);
        
        // let curval = result.recordset[0].CurVal;
        // let nextval = curval + 1;
        //sql.close();
        //await sql.connect(config);
        // SqlUpdate = `UPDATE AllSeq SET CurVal = ${nextval} WHERE TableName = '${tablename}'`;
        // result1 = await sql.query(SqlUpdate);
        console.log(result);
        sql.close();
        res.send(result);
    } 
    catch (error) {
      console.log(error);
    }
  });

  

    ///////////////////////////
    async function getSFTP() {
      const sftp = new Client();
    
      await sftp.connect({
        host: process.env.SSH_HOST,
        port: process.env.SSH_PORT,
        username: process.env.SSH_USERNAME,
        password: process.env.SSH_PASSWORD
      });
    
      return sftp;
    };

    let queryDept = (org,wdate) => {
      SqlQuery1 = `SELECT DeptCode, 0 as SectorCode,0 as DivCode,0 as UnitCode,0 
      AS UnitID,  0 as JobCode, DeptName AS SomeName, 0 as JobOklad, 2 as pDept,
      (select sum (S.jobOklad) from sprDepts D, Units U, Shtats S where 
      U.DeptCode = D.DeptCode 
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
			and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
		  and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumEmpOkl,
      (select sum (CEILING(S.Proc3 * S.jobOklad/100)) from sprDepts D, Units U, Shtats S where 
      U.DeptCode = D.DeptCode 
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
			and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
		  and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadVL,
      (select sum (CEILING(S.Proc4 * S.jobOklad/100)) from sprDepts D, Units U, Shtats S where 
      U.DeptCode = D.DeptCode 
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
			and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
		  and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadSec,
      (select sum (CEILING(S.Proc8 * S.jobOklad/100)) from sprDepts D, Units U, Shtats S where 
      U.DeptCode = D.DeptCode 
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
			and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
		  and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadMonth,
      (select sum (CEILING(S.Proc9 * S.jobOklad/100)) from sprDepts D, Units U, Shtats S where 
      U.DeptCode = D.DeptCode 
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
			and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
		  and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadSlozh,
      (select sum (Nadb10) from sprDepts D, Units U, Shtats S where 
      U.DeptCode = D.DeptCode 
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
			and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
		  and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadRang,
      (select sum (Nadb11) from sprDepts D, Units U, Shtats S where 
      U.DeptCode = D.DeptCode 
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
			and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
		  and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadZvan,
      (select sum (NADB12) from sprDepts D, Units U, Shtats S where 
      U.DeptCode = D.DeptCode 
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
			and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
		  and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadRash
      FROM sprDepts SD
      WHERE 
      BDate <= '${wdate}' AND (FDate >= '${wdate}' OR FDate IS NULL) 
      AND OrgCode =${org} AND  NOT (DeptName = '---' OR DeptName IS NULL)`;
      return SqlQuery1;
    }

    let querySector = (org,wdate) => {
      SqlQuery2 = `SELECT DeptCode, SectorCode,0 as DivCode,0 as UnitCode,
      0 AS UnitID, 0 as JobCode, SectorName AS SomeName, 0 as JobOklad, 3 as pDept,
      (select sum (s.jobOklad) from sprSectors D, Units U, Shtats S where U.DeptCode = D.DeptCode
      and U.SectorCode =  D.SectorCode
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
      and D.SectorCode = SD.SectorCode
	    and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
	    and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumEmpOkl,
      (select sum (CEILING(S.Proc3 * S.jobOklad/100)) from sprSectors D, Units U, Shtats S where U.DeptCode = D.DeptCode
      and U.SectorCode =  D.SectorCode
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
      and D.SectorCode = SD.SectorCode
	    and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
	    and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadVL,
      (select sum (CEILING(S.Proc4 * S.jobOklad/100)) from sprSectors D, Units U, Shtats S where U.DeptCode = D.DeptCode
      and U.SectorCode =  D.SectorCode
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
      and D.SectorCode = SD.SectorCode
	    and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
	    and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadSec,
      (select sum (CEILING(S.Proc8 * S.jobOklad/100)) from sprSectors D, Units U, Shtats S where U.DeptCode = D.DeptCode
      and U.SectorCode =  D.SectorCode
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
      and D.SectorCode = SD.SectorCode
	    and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
	    and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadMonth,
      (select sum (CEILING(S.Proc9 * S.jobOklad/100)) from sprSectors D, Units U, Shtats S where U.DeptCode = D.DeptCode
      and U.SectorCode =  D.SectorCode
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
      and D.SectorCode = SD.SectorCode
	    and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
	    and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadSlozh,
      (select sum (Nadb10) from sprSectors D, Units U, Shtats S where U.DeptCode = D.DeptCode
      and U.SectorCode =  D.SectorCode
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
      and D.SectorCode = SD.SectorCode
	    and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
	    and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadRang,
      (select sum (Nadb11) from sprSectors D, Units U, Shtats S where U.DeptCode = D.DeptCode
      and U.SectorCode =  D.SectorCode
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
      and D.SectorCode = SD.SectorCode
	    and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
	    and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadZvan,
      (select sum (NADB12) from sprSectors D, Units U, Shtats S where U.DeptCode = D.DeptCode
      and U.SectorCode =  D.SectorCode
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
      and D.SectorCode = SD.SectorCode
	    and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
	    and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadRash
      FROM sprSectors SD
      WHERE 
      BDate <= '${wdate}' AND (FDate >= '${wdate}' OR FDate IS NULL) 
      AND OrgCode =${org} AND  NOT (SectorName = '---' OR SectorName IS NULL)  `;
      return SqlQuery2;
    };

    let queryDiv = (org,wdate) => {
      SqlQuery3 = `SELECT DeptCode, SectorCode,DivCode,0 as UnitCode,
      0 AS UnitID, 0 as JobCode, DivName AS SomeName, 0 as JobOklad, 4 as pDept,
      (select sum (s.jobOklad) from sprDivs D, Units U, Shtats S where U.DeptCode = D.DeptCode
      and U.SectorCode =  D.SectorCode
      and U.DivCode = D.DivCode
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
      and D.SectorCode = SD.SectorCode
      and D.DivCode = SD.DivCode
	    and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
	    and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumEmpOkl,
      (select sum (CEILING(S.Proc3 * S.jobOklad/100)) from sprDivs D, Units U, Shtats S where U.DeptCode = D.DeptCode
      and U.SectorCode =  D.SectorCode
      and U.DivCode = D.DivCode
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
      and D.SectorCode = SD.SectorCode
	    and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
	    and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadVL,
      (select sum (CEILING(S.Proc4 * S.jobOklad/100)) from sprDivs D, Units U, Shtats S where U.DeptCode = D.DeptCode
      and U.SectorCode =  D.SectorCode
      and U.DivCode = D.DivCode
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
      and D.SectorCode = SD.SectorCode
	    and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
	    and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadSec,
      (select sum (CEILING(S.Proc8 * S.jobOklad/100)) from sprDivs D, Units U, Shtats S where U.DeptCode = D.DeptCode
      and U.SectorCode =  D.SectorCode
      and U.DivCode = D.DivCode
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
      and D.SectorCode = SD.SectorCode
	    and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
	    and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadMonth,
      (select sum (CEILING(S.Proc9 * S.jobOklad/100)) from sprDivs D, Units U, Shtats S where U.DeptCode = D.DeptCode
      and U.SectorCode =  D.SectorCode
      and U.DivCode = D.DivCode
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
      and D.SectorCode = SD.SectorCode
	    and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
	    and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadSlozh,
      (select sum (Nadb10) from sprDivs D, Units U, Shtats S where U.DeptCode = D.DeptCode
      and U.SectorCode =  D.SectorCode
      and U.DivCode = D.DivCode
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
      and D.SectorCode = SD.SectorCode
	    and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
	    and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadRang,
      (select sum (Nadb11) from sprDivs D, Units U, Shtats S where U.DeptCode = D.DeptCode
      and U.SectorCode =  D.SectorCode
      and U.DivCode = D.DivCode
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
      and D.SectorCode = SD.SectorCode
	    and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
	    and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadZvan,
      (select sum (NADB12) from sprDivs D, Units U, Shtats S where U.DeptCode = D.DeptCode
      and U.SectorCode =  D.SectorCode
      and U.DivCode = D.DivCode
      and S.UnitID = U.UnitID 
      and D.DeptCode = SD.DeptCode 
      and D.SectorCode = SD.SectorCode
	    and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
	    and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL) 
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL) 
      ) sumNadRash
      FROM sprDivs SD
      WHERE 
      BDate <= '${wdate}' AND (FDate >= '${wdate}' OR FDate IS NULL) 
      AND OrgCode =${org} AND  NOT (DivName = '---' OR DivName IS NULL)  `;
      return SqlQuery3;
    } 

    let queryDept2 = (org,wdate) => {
      SqlQuery1 = `SELECT D.DeptCode as DeptCode, 
      0 as SectorCode,
      0 as DivCode,
      0 as UnitCode,
      0 as UnitID,  
      0 as JobCode, 
      0 as empCode,
      DeptName AS SomeName, 
      sum (S.jobOklad) sumJobOkl,
      0 as JobOklad, 
      2 as pDept,
      sum (S.jobOklad) sumEmpOkl,
			sum (CEILING(S.Proc3 * S.jobOklad/100)) sumNadVL,
			sum (CEILING(S.Proc4 * S.jobOklad/100)) sumNadSec,
      sum (CEILING(S.Proc8 * S.jobOklad/100)) sumNadMonth,
      sum (CEILING(S.Proc9 * S.jobOklad/100)) sumNadSlozh,
      sum (Nadb10) sumNadRang, 
      sum (Nadb11) sumNadZvan, 
      sum (Nadb12) sumNadRash, 
      '---' as status,
      0 as proc1
			from sprDepts D, Units U, Shtats S 
			where U.DeptCode = D.DeptCode
			and S.UnitID = U.UnitID 
			and D.OrgCode=${org}
            and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
            and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL)
           and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL)
       Group BY D.DeptCode,D.DeptName`;
       return SqlQuery1;

    }

    let querySector2 = (org,wdate) => {
      SqlQuery2 = `SELECT D.DeptCode as DeptCode,
      D.SectorCode as SectorCode,
      0 as DivCode,
      0 as UnitCode,
      0 AS UnitID,  
      0 as JobCode,
      0 as empCode, 
      SectorName AS SomeName, 
      sum (S.jobOklad) sumJobOkl, 
      0 as JobOklad,
      3 as pDept,
      sum (S.jobOklad) sumEmpOkl,
			sum (CEILING(S.Proc3 * S.jobOklad/100)) sumNadVL,
			sum (CEILING(S.Proc4 * S.jobOklad/100)) sumNadSec,
      sum (CEILING(S.Proc8 * S.jobOklad/100)) sumNadMonth,
      sum (CEILING(S.Proc9 * S.jobOklad/100)) sumNadSlozh,
      sum (Nadb10) sumNadRang, 
      sum (Nadb11) sumNadZvan, 
      sum (Nadb12) sumNadRash, 
      '---' as status,
      0 as proc1
			from sprSectors D, Units U, Shtats S 
			where 
			U.DeptCode = D.DeptCode
			and U.SectorCode =D.SectorCode
			and S.UnitID = U.UnitID 
			and D.OrgCode=${org}
            and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
            and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL)
           and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL)
		   and D.SectorCode >0
		   Group BY D.DeptCode,D.SectorCode,D.SectorName`;
      return SqlQuery2;
    }
    let queryDiv2 = (org,wdate) => {
      SqlQuery3 = `SELECT D.DeptCode as DeptCode,
      D.SectorCode as SectorCode,
      D.DivCode as DivCode,
      0 as UnitCode,
      0 AS UnitID,  
      0 as JobCode,
      0 as empCode, 
      D.DivName AS SomeName, 
      sum (S.jobOklad) sumJobOkl, 
      0 as JobOklad, 
      4 as pDept,
      sum (S.jobOklad) sumEmpOkl,
			sum (CEILING(S.Proc3 * S.jobOklad/100)) sumNadVL,
			sum (CEILING(S.Proc4 * S.jobOklad/100)) sumNadSec,
      sum (CEILING(S.Proc8 * S.jobOklad/100)) sumNadMonth,
      sum (CEILING(S.Proc9 * S.jobOklad/100)) sumNadSlozh,
      sum (Nadb10) sumNadRang, 
      sum (Nadb11) sumNadZvan, 
      sum (Nadb12) sumNadRash, 
      '---' as status,
      0 as proc1   
			from sprDivs D, Units U, Shtats S 
			where 
			U.DeptCode = D.DeptCode
			and U.SectorCode =D.SectorCode
			and U.DivCode =D.DivCode
			and S.UnitID = U.UnitID 
			and D.OrgCode=${org}
            and D.BDate <= '${wdate}' AND (D.FDate >= '${wdate}' OR D.FDate IS NULL)
            and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL)
           and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL)
		   and D.DivCode >0
		   and S.pDecret=0
       Group BY D.DeptCode,D.SectorCode,D.DivCode,D.DivName`;
       return SqlQuery3;
    }

    let queryUnit2 = (org,wdate) => {
      SqlQuery4 = `SELECT U.DeptCode,
      U.SectorCode as SectorCode,
      U.DivCode as DivCode,
      U.UnitCode as UnitCode,
      U.UnitID, 
      U.JobCode,
      0 as empCode,
      J.JobName AS SomeName, 
      0 sumJobOkl,
      0 as JobOklad, 
      5 as pDept,
      
      0 sumEmpOkl,
			0 sumNadVL,
			0 sumNadSec,
      0 sumNadMonth,
      0 sumNadSlozh,
      0 sumNadRang, 
      0 sumNadZvan, 
      0 sumNadRash, 
      '---' as status,
      0 as proc1   
			from sprJobs J, Units U, Shtats S 
			where 
			J.JobCode = U.JobCode
			and S.UnitID = U.UnitID 
			and U.OrgCode=${org}
      and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL)
      and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL)
		  and J.BDate <= '${wdate}' AND (J.FDate >= '${wdate}' OR J.FDate IS NULL)`;
       return SqlQuery4;
    }

    let queryEmp2 = (org,wdate) => {
      SqlQuery5 = `SELECT U.DeptCode,
      U.SectorCode as SectorCode,
      U.DivCode as DivCode,
      U.UnitCode as UnitCode,
      U.UnitID, 
      U.JobCode,
      E.empKod as empCode, 
      E.FIO AS SomeName, 
      0 sumJobOkl,
      S.jobOklad as JobOklad, 
      6 as pDept,
      S.jobOklad sumEmpOkl,
			CEILING(S.Proc3 * S.jobOklad/100) sumNadVL,
			CEILING(S.Proc4 * S.jobOklad/100) sumNadSec,
      CEILING(S.Proc8 * S.jobOklad/100) sumNadMonth,
      CEILING(S.Proc9 * S.jobOklad/100) sumNadSlozh,
      Nadb10 sumNadRang, 
      Nadb11 sumNadZvan, 
      Nadb12 sumNadRash, 
      str(S.pDecret,1) + str(S.pOtpuskBS,1) + str(S.pSovm,1) + str(S.pVrem,1) as status,
      S.procOklad as proc1
			from Emps E, Units U, Shtats S 
			where 
			E.EmpKod = S.EmpKod
			and S.UnitID = U.UnitID 
			and U.OrgCode=${org}
            and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL)
           and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL)
       and E.BDate <= '${wdate}' AND (E.FDate >= '${wdate}' OR E.FDate IS NULL)`;
       return SqlQuery5;
    }

    let queryVac = (org,wdate) => {
      SqlQuery6 =`SELECT U.DeptCode as DeptCode,
      U.SectorCode as SectorCode,
      U.DivCode as DivCode,
      U.UnitCode as UnitCode, 
      U.UnitID,  
      U.JobCode,
      0 as empCode,
      J.JobName + '--- Вакансия' AS SomeName,
      0 sumJobOkl,
      U.jobOklad as JobOklad,
      7 as pDept,
		  0 sumEmpOkl,
			0 sumNadVL,
			0 sumNadSec,
      0 sumNadMonth,
      0 sumNadSlozh,
      0 sumNadRang, 
      0 sumNadZvan, 
      0 sumNadRash, 
      '---' as status,
      0 as proc1
			from Units U,sprJobs J 
			where 
      J.JobCode = U.JobCode 
     
			and U.OrgCode=${org}
            and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL)
           and (NOT EXISTS(SELECT ShtatID FROM Shtats S1 
                       WHERE S1.UnitID =U.UnitID 
             and  '${wdate}' BETWEEN S1.BDate AND  ISNULL(S1.FDate,'${wdate}')))`;
             return SqlQuery6;
    }

  let nextsec = async (tablename) => {
    try {
      
        let result;
        let SqlQuery;
        let SqlUpdate;
        let result1;
        await sql.connect(config);
        
        SqlQuery = `SELECT CurVal FROM AllSeq WHERE TableName ='${tablename}'`;
        
       // console.log(SqlQuery);
        result = await sql.query(SqlQuery);
        
       // res.setHeader(`content-type`, `text/plain`);
        
        let curval = result.recordset[0].CurVal;
        let nextval = curval + 1;
        
        SqlUpdate = `UPDATE AllSeq SET CurVal = ${nextval} WHERE TableName = '${tablename}'`;
        result1 = await sql.query(SqlUpdate);
        return curval;
    } 
    catch (error) {
      console.log(error);
    }  
};

let addDefaultSector = async (OrgCode,DeptCode,mbdate,mfdate,comm) => {
  try {
  let SqlQuery2;
    //await sql.connect(config);
    SqlQuery2 = `Insert sprSectors (OrgCode,DeptCode,SectorCode,SectorName,bdate,fdate,Comments) 
        values(${OrgCode},${DeptCode},0,'---','${mbdate}',${mfdate},'${comm}')`;
                   
     console.log(SqlQuery2);
      let result;
      await sql.connect(config);
      result = await sql.query(SqlQuery2);
    } 
    catch (error) {
      console.log('q...' +error);
    }  
};

let addDefaultDiv = async (OrgCode,DeptCode,mbdate,mfdate,comm) => {
  try {
  let SqlQuery2;
    //await sql.connect(config);
    SqlQuery2 = `Insert sprDivs (OrgCode,DeptCode,SectorCode,DivCode,DivName,bdate,fdate,Comments) 
        values(${OrgCode},${DeptCode},0,0,'---','${mbdate}',${mfdate},'${comm}')`;
                   
     console.log(SqlQuery2);
      let result;
      await sql.connect(config);
      result = await sql.query(SqlQuery2);
    } 
    catch (error) {
      console.log('q...' +error);
    }  
};

let updatesec =  async (tablename) => {
  try {
      //const path1 = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
     //console.log(tablename);
      let result;
      let SqlQuery;
      let SqlUpdate;
      let result1;
      await sql.connect(config);
      
      SqlQuery = `SELECT CurVal FROM AllSeq WHERE TableName ='${tablename}'`;
      
     // console.log(SqlQuery);
      result = await sql.query(SqlQuery);
        
      let curval = result.recordset[0].CurVal;
      let nextval = curval + 1;
      
      SqlUpdate = `UPDATE AllSeq SET CurVal = ${nextval} WHERE TableName = '${tablename}'`;
      result1 = await sql.query(SqlUpdate);
      console.log(`NextVal` + nextval);
      return nextval;
  } 
  catch (error) {
    console.log(error);
  }
};

module.exports = router; 
