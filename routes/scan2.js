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

router.use(bodyParser());
const config = {
  user: 'sa',
  password: '1',
  server: '192.168.1.14', // You can use 'localhost\\instance' to connect to named instance
  database: 'Shtats18',
  port: 1111,
};

let writeLog = (text) => {
  fs.writeFile("nlog.txt", text , err => {
    if (err) console.log (`Не удалось: ${err}`);
  })
};
//const archivecode=1;
//let rootfolder = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
//let rootfolder = `L:/Arhive/Scans/Documents/CIAM/01-0179-0020-01934а/`;
//let rootfolder = `Z:/01-0002-0003-000013/`;
// let rootfolder = `\\\\192.168.1.12\\media\\01-0002-0003-000013\\`;
//let rootfolder = `\\\\192.168.1.12\\media\\`;
//router.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
//===============================================================================
router.post('/add-shtats', async (req, res) => {
  try {
      
      const SqlQuery = req.body.sql1;
      //const empCode = req.body.empCode;
                 
     console.log(SqlQuery);

      let result;
      await sql.connect(config);
            
      //let SqlQuery = `SELECT OsnName, Nadb10 FROM sprOsn10 ORDER BY OsnKod`;
      //console.log(SqlQuery);
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
      console.log(result);
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
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
      
      const OrgCode = req.body.OrgCode;
      const empCode = req.body.empCode;
                 
     console.log(empCode);

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

      Order By S.Bdate, S.Fdate`;
      //console.log(SqlQuery);
      
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
      // // let rootfolder = result1.recordset[0].RootFolder;
      
      //console.log(result.recordset);
      //  SqlQueries.push(SqlQuery1);
      // }
      // if (chAnnotFond == `true`) {
      //   SqlQuery2 = `SELECT FondNum,NULL OpisNum, NULL DeloNum, 2 Ps FROM sprFonds WHERE 
      //   Annotation Like '%${SearchStr}%' and ArhivCode=${archivecode}`;
      //   SqlQueries.push(SqlQuery2);         
      // }
      // if (chcbOpisName == `true`) {
      //   SqlQuery3 = `SELECT FondNum, OpisNum, NULL DeloNum, 3 Ps FROM sprOpises WHERE 
      //   OpisName Like '%${SearchStr}%' and ArhivCode=${archivecode}`;
      //   SqlQueries.push(SqlQuery3);         
      // }
      // if (chcbAnnotOpis == `true`) {
      //   SqlQuery4 = `SELECT FondNum, OpisNum, NULL DeloNum, 4 Ps FROM sprOpises WHERE 
      //   Annotation Like '%${SearchStr}%' and ArhivCode=${archivecode}`;
      //   SqlQueries.push(SqlQuery4);         
      // }
      // if (chcbDeloName == `true`) {
      //   SqlQuery5 = `SELECT FondNum, OpisNum, DeloNum, 5 Ps FROM DeloHeaders WHERE 
      //   DeloHeader Like '%${SearchStr}%' and ArhivCode=${archivecode}`;
      //   SqlQueries.push(SqlQuery5);         
      // }
      // //console.log(SqlQueries[0]+SqlQueries[1]);

      // let SqlQuery=``;
      // for (let i=0; i < SqlQueries.length; i++) {
      //     if (i > 0) {
      //       SqlQuery = SqlQuery + ` UNION ` + SqlQueries[i];
      //     }
      //     else {
      //       SqlQuery = SqlQueries[i];
      //     }
      // };
      // SqlQuery = SqlQuery + ` order by FondNum,OpisNum,DeloNum`;
      // //console.log(SqlQuery);
      // result = await sql.query(SqlQuery);
      res.setHeader(`content-type`, `text/plain`);
      sql.close();
      res.send(result);
     } 
  catch (error) {
    console.log(error);
  }
  
});



  router.get('/get-fonds', async (req, res) => {
    try {
        //const path1 = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
        const archivecode = req.query.archivecode;
        const fond = req.query.fond;
        const fondname = req.query.fondname;
        //console.log(archivecode+fond+fondname);

        let result;
        await sql.connect(config);
        result1 = await sql.query(`SELECT RootFolder from RootFolders where 
        ArhivCode=${archivecode} and Servername = '${process.env.DB_HOST}' and DocType='Docs2'`);
        let rootfolder = result1.recordset[0].RootFolder;
        //console.log(rootfolder);
        // let sess=req.session;
        
        // sess.rootfolder=rootfolder;
        if (fond !== '') {
          result = await sql.query(`SELECT distinct sd.FondNum ,f.FondName, f.bYear, 
          f.fYear from sprFonds f, ScanDocsInfo sd where sd.FondNum =f.FondNum and 
          sd.ArhivCode =f.ArhivCode and sd.ArhivCode=${archivecode} and f.FondNum=${fond} order by FondNum`);
        } 

        else if (fondname !== '') {
          result = await sql.query(`SELECT distinct sd.FondNum ,f.FondName, f.bYear, f.fYear from
          sprFonds f, ScanDocsInfo sd 
          where sd.FondNum =f.FondNum and sd.ArhivCode =f.ArhivCode and sd.ArhivCode=${archivecode} 
          and f.FondName like'%${fondname}%' order by FondNum`);
        }
        else {
          result = await sql.query(`SELECT distinct sd.FondNum ,f.FondName, f.bYear, f.fYear from 
          sprFonds f, ScanDocsInfo sd where sd.FondNum =f.FondNum and sd.ArhivCode =f.ArhivCode 
          and sd.ArhivCode=${archivecode} order by FondNum`);
        }
      
        res.setHeader(`content-type`, `text/plain`);
            
        sql.close();
          
        res.send(result);
           
        
      
    } 
    catch (error) {
      console.log(error);
    }
    
  }); 

  router.get('/get-opises', async (req, res) => {
    try {
        //const path1 = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
        // const test1 = req.params.fond;
        // console.log(test1);
        const archivecode = req.query.archivecode;
        const opisNum = req.query.opisNum;
        const fond = req.query.fond;
        //console.log(archivecode+fond+fondname);
        let result;
        await sql.connect(config);
        if (opisNum !== '') {
          result = await sql.query(`SELECT SD.OpisNum, DeloNum, TotPages, DeloLitera, DeloName, SO.bYear,
           SO.fYear, SD.FolderName
            FROM ScanDocsInfo SD,sprOpises SO WHERE SD.ArhivCode=${archivecode} AND SD.FondNum= ${fond} 
            and SO.FondNum = ${fond} and SD.OpisNum = SO.OpisNum and SD.OpisNum = ${opisNum} and SD.psecret = 0
            ORDER BY SD.OpisNum,DeloNum`);		 
        }  
  
      else {
        result = await sql.query(`SELECT SD.OpisNum, DeloNum, TotPages, DeloLitera, DeloName, 
        SO.bYear, SO.fYear, SD.FolderName
           FROM ScanDocsInfo SD,sprOpises SO WHERE SD.ArhivCode=${archivecode} AND SD.FondNum= ${fond} 
           and SO.FondNum = ${fond} and SD.OpisNum = SO.OpisNum and SD.psecret = 0
           ORDER BY SD.OpisNum,DeloNum`);		 
      }
      
        res.setHeader(`content-type`, `text/plain`);
            
        sql.close();
          
        res.send(result);
        
    } 
    catch (error) {
      console.log(error);
    }
    
  }); 

  router.get('/get-annot', async (req, res) => {
    try {
        //const path1 = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
        const archivecode = req.query.archivecode;
        //const opisNum = req.query.opisNum;
        const fond = req.query.fond;
        //console.log(archivecode+fond+fondname);
        let result;
        await sql.connect(config);
        result = await sql.query(`SELECT Annotation from sprFonds where ArhivCode=${archivecode} 
        and FondNum = ${fond}`);
        //console.log(result);
        res.setHeader(`content-type`, `text/plain`);
        sql.close();
        res.send(result);
    } 
    catch (error) {
      console.log(error);
    }
  });

 

  router.post('/get-fonds1', async (req, res) => {
    try {
        //const path1 = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
        const archivecode = req.body.archivecode;
        const fond = req.body.fond;
        const fondname = req.body.fondname;
       
       // console.log(archivecode+fond+fondname);

        let result;
        await sql.connect(config);
        result1 = await sql.query(`SELECT RootFolder from RootFolders where 
        ArhivCode=${archivecode} and Servername = '${process.env.DB_HOST}' and DocType='Docs2'`);
        let rootfolder = result1.recordset[0].RootFolder;
        //console.log(rootfolder);
        // let sess=req.session;
        
        // sess.rootfolder=rootfolder;
        if (fond !== '') {
          result = await sql.query(`SELECT distinct sd.FondNum ,f.FondName, f.bYear, 
          f.fYear from sprFonds f, ScanDocsInfo sd where sd.FondNum =f.FondNum and 
          sd.ArhivCode =f.ArhivCode and sd.ArhivCode=${archivecode} and f.FondNum=${fond} order by FondNum`);
        } 

        else if (fondname !== '') {
          result = await sql.query(`SELECT distinct sd.FondNum ,f.FondName, f.bYear, f.fYear from
          sprFonds f, ScanDocsInfo sd 
          where sd.FondNum =f.FondNum and sd.ArhivCode =f.ArhivCode and sd.ArhivCode=${archivecode} 
          and f.FondName like'%${fondname}%' order by FondNum`);
        }
        else {
          result = await sql.query(`SELECT distinct sd.FondNum ,f.FondName, f.bYear, f.fYear from 
          sprFonds f, ScanDocsInfo sd where sd.FondNum =f.FondNum and sd.ArhivCode =f.ArhivCode 
          and sd.ArhivCode=${archivecode} order by FondNum`);
        }
      
        res.setHeader(`content-type`, `text/plain`);
            
        sql.close();
          
        res.send(result);
         
    } 
    catch (error) {
      console.log(error);
    }
    
  }); 

  router.get('/get-orderdocs', async (req, res) => {
    try {
        //const path1 = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
        const scandocsid = req.query.scandocsid;
        //const opisNum = req.query.opisNum;
        //const fond = req.query.fond;
       // console.log(scandocsid);

        let result;
        await sql.connect(config);
        result = await sql.query(`SELECT FondNum, OpisNum, DeloNum, DeloLitera, TotPages, DeloName, FolderName
           FROM ScanDocsInfo WHERE ScanDocId IN (${scandocsid}) ORDER BY FondNum,OpisNum,DeloNum`);
        console.log(result);
        res.setHeader(`content-type`, `text/plain`);
        sql.close();
        res.send(result);
    } 
    catch (error) {
      console.log(error);
    }
  });

  router.post('/post-search', async (req, res) => {
    try {
        
        const archivecode = req.body.archivecode;
        const SearchStr = req.body.SearchStr;
        const chFondName = req.body.chFondName;
        const chAnnotFond = req.body.chAnnotFond;
        const chcbOpisName = req.body.chcbOpisName;
        const chcbAnnotOpis = req.body.chcbAnnotOpis;
        const chcbDeloName = req.body.chcbDeloName;
        
       console.log(archivecode+`-`+SearchStr+`-`+chFondName+`-`+chAnnotFond+`-`+chcbOpisName+`-`+chcbAnnotOpis+`-`+chcbDeloName);

        let result;
        let SqlQueries= [];

        await sql.connect(config);
        if (chFondName==`true`) {
          SqlQuery1 = `SELECT FondNum, NULL OpisNum, NULL DeloNum, 1 Ps FROM sprFonds 
          WHERE FondName Like '%${SearchStr}%' and ArhivCode=${archivecode}`;
         // result = await sql.query(SqlQuery1);
        // let rootfolder = result1.recordset[0].RootFolder;
        //console.log(result.recordset.FondNum);
         SqlQueries.push(SqlQuery1);
        }
        if (chAnnotFond == `true`) {
          SqlQuery2 = `SELECT FondNum,NULL OpisNum, NULL DeloNum, 2 Ps FROM sprFonds WHERE 
          Annotation Like '%${SearchStr}%' and ArhivCode=${archivecode}`;
          SqlQueries.push(SqlQuery2);         
        }
        if (chcbOpisName == `true`) {
          SqlQuery3 = `SELECT FondNum, OpisNum, NULL DeloNum, 3 Ps FROM sprOpises WHERE 
          OpisName Like '%${SearchStr}%' and ArhivCode=${archivecode}`;
          SqlQueries.push(SqlQuery3);         
        }
        if (chcbAnnotOpis == `true`) {
          SqlQuery4 = `SELECT FondNum, OpisNum, NULL DeloNum, 4 Ps FROM sprOpises WHERE 
          Annotation Like '%${SearchStr}%' and ArhivCode=${archivecode}`;
          SqlQueries.push(SqlQuery4);         
        }
        if (chcbDeloName == `true`) {
          SqlQuery5 = `SELECT FondNum, OpisNum, DeloNum, 5 Ps FROM DeloHeaders WHERE 
          DeloHeader Like '%${SearchStr}%' and ArhivCode=${archivecode}`;
          SqlQueries.push(SqlQuery5);         
        }
        //console.log(SqlQueries[0]+SqlQueries[1]);

        let SqlQuery=``;
        for (let i=0; i < SqlQueries.length; i++) {
            if (i > 0) {
              SqlQuery = SqlQuery + ` UNION ` + SqlQueries[i];
            }
            else {
              SqlQuery = SqlQueries[i];
            }
        };
        SqlQuery = SqlQuery + ` order by FondNum,OpisNum,DeloNum`;
        //console.log(SqlQuery);
        result = await sql.query(SqlQuery);
        res.setHeader(`content-type`, `text/plain`);
        sql.close();
        res.send(result);
       } 
    catch (error) {
      console.log(error);
    }
    
  });

  router.get('/get-cart', async (req, res) => {
    try {
        //const path1 = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
        const archivecode = req.query.archivecode;
        //const opisNum = req.query.opisNum;
        const fondnum = req.query.fondnum;
        const opisnum = req.query.opisnum;
        const delonum = req.query.delonum;
        //console.log(archivecode+fondnum+opisnum+delonum);
        let result;
        let SqlQuery;
        await sql.connect(config);
        if(delonum !==`null`) {
          SqlQuery = `select f.FondName fn,f.Annotation fa,o.OpisName opn,o.Annotation oan,d.DeloHeader dh
            from sprFonds f,sprOpises o, DeloHeaders d 
          where f.FondNum =${fondnum} and o.FondNum =${fondnum} and d.FondNum=${fondnum} and
          o.OpisNum=${opisnum} and d.OpisNum=${opisnum} and d.DeloNum=${delonum} and 
          f.ArhivCode=${archivecode} and o.ArhivCode=${archivecode} and d.ArhivCode=${archivecode}`;
        }
        if( delonum==`null` && opisnum !== `null`) {
          SqlQuery = `select f.FondName fn,f.Annotation fa,o.OpisName opn,o.Annotation oan
            from sprFonds f,sprOpises o
          where f.FondNum =${fondnum} and o.FondNum =${fondnum} and
          o.OpisNum=${opisnum} and 
          f.ArhivCode=${archivecode} and o.ArhivCode=${archivecode}`;
        }
        if ( fondnum !==`null` && opisnum == `null` && delonum == `null`){
          SqlQuery = `select f.FondName fn,f.Annotation fa
          from sprFonds f where f.FondNum =${fondnum} and f.ArhivCode=${archivecode}`;
          } 
          // if (fondnum !==`null`) {
        //   result = await sql.query(`SELECT FondName,Annotation from sprFonds where ArhivCode=${archivecode} 
        //   and FondNum = ${fondnum}`);
        // }
        //console.log(SqlQuery);
        result = await sql.query(SqlQuery);
        console.log(result);
        res.setHeader(`content-type`, `text/plain`);
        sql.close();
        if (result.rowsAffected[0] !==0) {
          res.send(result);
        }
        else {res.send(`0`);}
        
    } 
    catch (error) {
      console.log(error);
    }
  });

  router.post('/get-exists', async (req, res) => {
    try {
        //const path1 = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
        const archivecode = req.body.archivecode;
        //const opisNum = req.query.opisNum;
        const fondnum = req.body.fondnum;
        const opisnum = req.body.opisnum;
        const delonum = req.body.delonum;
        const delolit = req.body.delolit;
       // console.log(archivecode+fondnum+opisnum+delonum+delolit);
        let result;
        let SqlQuery;
        await sql.connect(config);
        if(delolit !==``) {
          SqlQuery = `select scandocid from scandocsinfo
          where FondNum =${fondnum} and
          OpisNum=${opisnum} and DeloNum=${delonum} and DeloLitera='${delolit}' and ArhivCode=${archivecode}`;
        }
        else {
          SqlQuery = `select scandocid from scandocsinfo
          where FondNum =${fondnum} and OpisNum=${opisnum} and DeloNum=${delonum} and ArhivCode=${archivecode}`;
        }
       // console.log(SqlQuery);
        result = await sql.query(SqlQuery);
        
        res.setHeader(`content-type`, `text/plain`);
        sql.close();
        if (result.rowsAffected[0] !==0) {
          res.send(`1`);
        }
        else {res.send(`0`);}
        
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
      str(S.pDecret,1) +str(S.pOtpuskBS,1) +str(S.pSovm,1) ++str(S.pVrem,1) as status,
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
      'Вакансия' AS SomeName,
      0 sumJobOkl,
      S.jobOklad as JobOklad,
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
			from Units U,sprJobs J, Shtats S 
			where 
      J.JobCode = U.JobCode 
      and S.UnitID = U.UnitID
			and U.OrgCode=${org}
            and U.BDate <= '${wdate}' AND (U.FDate >= '${wdate}' OR U.FDate IS NULL)
           and (NOT EXISTS(SELECT ShtatID FROM Shtats S 
                       WHERE S.UnitID =U.UnitID 
             and S.BDate <= '${wdate}' AND (S.FDate >= '${wdate}' OR S.FDate IS NULL)))`;
             return SqlQuery6;
    }

module.exports = router; 
