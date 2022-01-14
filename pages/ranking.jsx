import React, { useState, useEffect } from "react";
import Head from "next/head";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { createTheme, ThemeProvider } from '@material-ui/core';
var colors=['clicked','secondary','secondary','secondary','secondary']

const useStyles = makeStyles({
  table: {
    maxHeight:500,
    minWidth:300,
    overflowY:'scroll',
  },
  bgroup:{
    maxWidth:'95%',
    position:'sticky',
    display:'block',
    zIndex:1,
  },
  
  sticky:{
    position:'sticky',
  },
  fixed:{
    position:'fixed',
    margin: "auto", /* Will not center vertically and won't work in IE6/7. */
    left: 0,
    right: 0,
  },
  tContain:{
    maxHeight:500,
    overflowY:'scroll',
    position:'relative',
  },
});

const theme = createTheme({
  palette: {
    
    secondary: {
      main: "#c2240b",
      light: "#ae240e"
    },
    
  }
});


function createData(order,rank, name, schoolName, score) {
  return { order,rank, name, schoolName, score };
}


export default function RankingList({
  hRankings,
  kRankings,
  nRankings,
  oRankings,
  mRankings,
}) {
  const classes = useStyles();
  const [rows, setRowData] = useState([]);
  const [divisionTitle, setDivisionTitle] = useState("Overall");

  useEffect(() => {
    loadsRankings(oRankings);
  }, []);
  function setColors(buttonindex){
    for (var colorsIndex=0;colorsIndex<colors.length;colorsIndex++){
      if (colorsIndex==buttonindex){colors[colorsIndex]='clicked'}
      else{colors[colorsIndex]='secondary'}

    }
  }
  function loadsRankings(rankings) {
    let data = [];
    rankings.sort(sortBy("score"));
	  let oldscore=0;
    let oldrank=0;
    rankings.map((rank, index) => {
      if (oldscore===rank.score){
      data.push(
        createData(index+1,oldrank, rank.name, rank.schoolName, rank.score)
      );}
      else{data.push(
        createData(index+1,index + 1, rank.name, rank.schoolName, rank.score)
      );
      oldrank=index+1;}
      oldscore=rank.score;
      
    });
    setRowData(data);
  }
  const districtRankings=[oRankings,hRankings,kRankings,nRankings,mRankings]
  const divisionNames=["Overall","Hong Kong Island","Kowloon","New Territories","Macau"]
  var notEmpty=[]
  for (var divisionIndex=0;divisionIndex<districtRankings.length;divisionIndex++){
    if (districtRankings[divisionIndex].length){
    notEmpty.push(divisionIndex)}
  };
  hvheadhtml=(<ThemeProvider theme={theme}>
  <Container className={classes.fixed} maxWidth="md">
  
         <Typography className={classes.sticky}  variant="h3" align="center" gutterBottom>
      Leaderboard
    </Typography>
         
  
  <Box className={classes.sticky} textAlign='center'>
  <Grid container className={classes.sticky} justify="center">
    <ButtonGroup  className={classes.bgroup} 
      variant="contained"  aria-label="contained primary button group"
      display='flex' justifyContent='center'
    >
      {notEmpty.map((districtIndex) => (
         <Button color={colors[districtIndex]}
         onClick={() => {
           setColors(districtIndex);
           loadsRankings(districtRankings[districtIndex]);
           setDivisionTitle(divisionNames[districtIndex]);
         }}
       >
         {divisionNames[districtIndex]}
       </Button>))}
       
      
    </ButtonGroup>
    </Grid>
    </Box>
    
    
    <TableContainer className={classes.tContain} component={Paper}>
      <Table stickyHeader className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">School</TableCell>
            <TableCell align="center">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.order}>
              <TableCell component="th" scope="row">
                {row.rank}
              </TableCell>
              <TableCell align="center">{row.name}</TableCell>
              <TableCell align="center">{row.schoolName}</TableCell>
              <TableCell align="center">{row.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Container>
  </ThemeProvider>);
  if (notEmpty.length){var havehead=[hvheadhtml]}else{var havehead=[]}

  return (
      <>
    <Head>
    <title>ICE Challenge - Ranking</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
    <link rel="icon" href="/favicon.ico" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
  </Head>
  {havehead.map((i) => (
  i
    ))}
    </>
  );
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const kRankings = [];
  const hRankings = [];
  const oRankings = [];
  const nRankings = [];
  const mRankings = [];
  const hres = await fetch(
    `https://codecombat.com/db/level/5fca06dc8b4da8002889dbf1/rankings?order=-1&scoreOffset=1000000&team=humans&leagues.leagueID=61d3a182f4636d064c6f5de5&limit=100`
  );
  const hdata = await hres.json();
  

  const HKschoolData = [
    
     {
       "codecomabtName": "ICE-HKP-0001",
       "schoolName": "SKH ST PETER'S PRIMARY SCHOOL",
       "creatorID": "61d29d2bf7358e11a02648f6"
     },
     {
       "codecomabtName": "ICE-HKP-0002",
       "schoolName": "SKH ST PETER'S PRIMARY SCHOOL",
       "creatorID": "61d29d2ef7358e11a02648f7"
     },
     {
       "codecomabtName": "ICE-HKP-0003",
       "schoolName": "SKH ST PETER'S PRIMARY SCHOOL",
       "creatorID": "61d29d32f7358e11a02648f8"
     },
     {
       "codecomabtName": "ICE-HKP-0004",
       "schoolName": "SKH ST PETER'S PRIMARY SCHOOL",
       "creatorID": "61d29d34f7358e11a02648f9"
     },
     {
       "codecomabtName": "ICE-HKP-0005",
       "schoolName": "SKH ST PETER'S PRIMARY SCHOOL",
       "creatorID": "61d29d36f7358e11a02648fa"
     },
     {
       "codecomabtName": "ICE-HKP-0006",
       "schoolName": "SKH ST PETER'S PRIMARY SCHOOL",
       "creatorID": "61d29d39f7358e11a02648fb"
     },
     {
       "codecomabtName": "ICE-HKP-0007",
       "schoolName": "SKH ST PETER'S PRIMARY SCHOOL",
       "creatorID": "61d29d3cf7358e11a02648fc"
     },
     {
       "codecomabtName": "ICE-HKP-0008",
       "schoolName": "SKH ST PETER'S PRIMARY SCHOOL",
       "creatorID": "61d29d3ef7358e11a02648fd"
     },
     {
       "codecomabtName": "ICE-HKP-0009",
       "schoolName": "SKH ST PETER'S PRIMARY SCHOOL",
       "creatorID": "61d29d40f7358e11a02648fe"
     },
     {
       "codecomabtName": "ICE-HKP-0010",
       "schoolName": "SKH ST PETER'S PRIMARY SCHOOL",
       "creatorID": "61d29d43f7358e11a02648ff"
     },
     {
       "codecomabtName": "ICE-HKP-0011",
       "schoolName": "SKH ST PETER'S PRIMARY SCHOOL",
       "creatorID": "61d29d46f7358e11a0264900"
     },
     {
       "codecomabtName": "ICE-HKP-0012",
       "schoolName": "SKH ST PETER'S PRIMARY SCHOOL",
       "creatorID": "61d29d49f7358e11a0264901"
     },
     {
       "codecomabtName": "ICE-HKP-0013",
       "schoolName": "SKH ST PETER'S PRIMARY SCHOOL",
       "creatorID": "61d29d4df7358e11a0264902"
     },
     {
       "codecomabtName": "ICE-HKP-0014",
       "schoolName": "ST ANTHONY'S SCHOOL",
       "creatorID": "61d29d4ff7358e11a0264903"
     },
     {
       "codecomabtName": "ICE-HKP-0015",
       "schoolName": "ST ANTHONY'S SCHOOL",
       "creatorID": "61d29d51f7358e11a0264904"
     },
     {
       "codecomabtName": "ICE-HKP-0016",
       "schoolName": "HKUGA PRIMARY SCHOOL",
       "creatorID": "61d29d55f7358e11a0264905"
     },
     {
       "codecomabtName": "ICE-HKP-0017",
       "schoolName": "HKUGA PRIMARY SCHOOL",
       "creatorID": "61d29d57f7358e11a0264906"
     },
     {
       "codecomabtName": "ICE-HKP-0018",
       "schoolName": "RAIMONDI COLLEGE PRIMARY SECTION",
       "creatorID": "61d29d5bf7358e11a0264907"
     },
     {
       "codecomabtName": "ICE-HKP-0019",
       "schoolName": "RAIMONDI COLLEGE PRIMARY SECTION",
       "creatorID": "61d29d5ef7358e11a0264908"
     },
     {
       "codecomabtName": "ICE-HKP-0020",
       "schoolName": "SKH ST JAMES' PRIMARY SCHOOL",
       "creatorID": "61d29d61f7358e11a0264909"
     },
     {
       "codecomabtName": "ICE-HKP-0021",
       "schoolName": "SKH ST JAMES' PRIMARY SCHOOL",
       "creatorID": "61d29d64f7358e11a026490a"
     },
     {
       "codecomabtName": "ICE-HKP-0022",
       "schoolName": "PUN U ASSOCIATION WAH YAN PRIMARY SCHOOL",
       "creatorID": "61d29d67f7358e11a026490b"
     },
     {
       "codecomabtName": "ICE-HKP-0023",
       "schoolName": "PUN U ASSOCIATION WAH YAN PRIMARY SCHOOL",
       "creatorID": "61d29d6cf7358e11a026490c"
     },
     {
       "codecomabtName": "ICE-HKP-0024",
       "schoolName": "PUN U ASSOCIATION WAH YAN PRIMARY SCHOOL",
       "creatorID": "61d29d6ef7358e11a026490d"
     },
     {
       "codecomabtName": "ICE-HKP-0025",
       "schoolName": "PUN U ASSOCIATION WAH YAN PRIMARY SCHOOL",
       "creatorID": "61d29d71f7358e11a026490e"
     },
     {
       "codecomabtName": "ICE-HKP-0026",
       "schoolName": "APLICHAU KAIFONG PRIMARY SCHOOL",
       "creatorID": "61d29d73f7358e11a026490f"
     },
     {
       "codecomabtName": "ICE-HKP-0027",
       "schoolName": "HENNESSY ROAD GOVERNMENT PRIMARY SCHOOL",
       "creatorID": "61d29d76f7358e11a0264910"
     },
     {
       "codecomabtName": "ICE-HKP-0028",
       "schoolName": "BUDDHIST WONG CHEUK UM PRIMARY SCHOOL",
       "creatorID": "61d29d78f7358e11a0264911"
     },
     {
       "codecomabtName": "ICE-HKP-0029",
       "schoolName": "SINGAPORE INTERNATIONAL SCHOOL (HONG KONG) (PRIMARY)",
       "creatorID": "61d29d7af7358e11a0264912"
     },
     {
       "codecomabtName": "ICE-HKP-0030",
       "schoolName": "SHANGHAI ALUMNI PRIMARY SCHOOL",
       "creatorID": "61d29d7df7358e11a0264913"
     },
     {
       "codecomabtName": "ICE-HKS-0031",
       "schoolName": "ABERDEEN BAPTIST LUI MING CHOI COLLEGE",
       "creatorID": "61d29d80f7358e11a0264914"
     },
     {
       "codecomabtName": "ICE-HKS-0032",
       "schoolName": "ABERDEEN BAPTIST LUI MING CHOI COLLEGE",
       "creatorID": "61d29d82f7358e11a0264915"
     },
     {
       "codecomabtName": "ICE-HKS-0033",
       "schoolName": "ABERDEEN BAPTIST LUI MING CHOI COLLEGE",
       "creatorID": "61d29d87f7358e11a0264916"
     },
     {
       "codecomabtName": "ICE-HKS-0034",
       "schoolName": "ABERDEEN BAPTIST LUI MING CHOI COLLEGE",
       "creatorID": "61d29d8ef7358e11a0264917"
     },
     {
       "codecomabtName": "ICE-HKS-0035",
       "schoolName": "ABERDEEN BAPTIST LUI MING CHOI COLLEGE",
       "creatorID": "61d29d92f7358e11a0264918"
     },
     {
       "codecomabtName": "ICE-HKS-0036",
       "schoolName": "ABERDEEN BAPTIST LUI MING CHOI COLLEGE",
       "creatorID": "61d29d94f7358e11a0264919"
     },
     {
       "codecomabtName": "ICE-HKS-0037",
       "schoolName": "ABERDEEN BAPTIST LUI MING CHOI COLLEGE",
       "creatorID": "61d29d98f7358e11a026491a"
     },
     {
       "codecomabtName": "ICE-HKS-0038",
       "schoolName": "ABERDEEN BAPTIST LUI MING CHOI COLLEGE",
       "creatorID": "61d29d9cf7358e11a026491b"
     },
     {
       "codecomabtName": "ICE-HKS-0039",
       "schoolName": "ABERDEEN BAPTIST LUI MING CHOI COLLEGE",
       "creatorID": "61d29da0f7358e11a026491c"
     },
     {
       "codecomabtName": "ICE-HKS-0040",
       "schoolName": "ABERDEEN BAPTIST LUI MING CHOI COLLEGE",
       "creatorID": "61d29da3f7358e11a026491d"
     },
     {
       "codecomabtName": "ICE-HKS-0041",
       "schoolName": "ABERDEEN BAPTIST LUI MING CHOI COLLEGE",
       "creatorID": "61d29da5f7358e11a026491e"
     },
     {
       "codecomabtName": "ICE-HKS-0042",
       "schoolName": "ABERDEEN BAPTIST LUI MING CHOI COLLEGE",
       "creatorID": "61d29da8f7358e11a026491f"
     },
     {
       "codecomabtName": "ICE-HKS-0043",
       "schoolName": "TRUE LIGHT MIDDLE SCHOOL OF HONG KONG",
       "creatorID": "61d29daaf7358e11a0264920"
     },
     {
       "codecomabtName": "ICE-HKS-0044",
       "schoolName": "TRUE LIGHT MIDDLE SCHOOL OF HONG KONG",
       "creatorID": "61d29dacf7358e11a0264921"
     },
     {
       "codecomabtName": "ICE-HKS-0045",
       "schoolName": "TRUE LIGHT MIDDLE SCHOOL OF HONG KONG",
       "creatorID": "61d29db6f7358e11a0264922"
     },
     {
       "codecomabtName": "ICE-HKS-0046",
       "schoolName": "St. Paul’s secondary school",
       "creatorID": "61d29db9f7358e11a0264923"
     },
     {
       "codecomabtName": "ICE-HKS-0047",
       "schoolName": "St. Paul’s secondary school",
       "creatorID": "61d29dbbf7358e11a0264924"
     },
     {
       "codecomabtName": "ICE-HKS-0048",
       "schoolName": "St. Paul’s secondary school",
       "creatorID": "61d29dbff7358e11a0264925"
     },
     {
       "codecomabtName": "ICE-HKS-0049",
       "schoolName": "ST LOUIS SCHOOL",
       "creatorID": "61d29dc2f7358e11a0264926"
     },
     {
       "codecomabtName": "ICE-HKS-0050",
       "schoolName": "ST LOUIS SCHOOL",
       "creatorID": "61d29dc5f7358e11a0264927"
     },
     {
       "codecomabtName": "ICE-HKS-0051",
       "schoolName": "ST LOUIS SCHOOL",
       "creatorID": "61d29dc9f7358e11a0264928"
     },
     {
       "codecomabtName": "ICE-HKS-0052",
       "schoolName": "ST LOUIS SCHOOL",
       "creatorID": "61d29dcbf7358e11a0264929"
     },
     {
       "codecomabtName": "ICE-HKS-0053",
       "schoolName": "ST LOUIS SCHOOL",
       "creatorID": "61d29dcef7358e11a026492a"
     },
     {
       "codecomabtName": "ICE-HKS-0054",
       "schoolName": "ST LOUIS SCHOOL",
       "creatorID": "61d29dd1f7358e11a026492b"
     },
     {
       "codecomabtName": "ICE-HKS-0055",
       "schoolName": "ST LOUIS SCHOOL",
       "creatorID": "61d29dd4f7358e11a026492c"
     },
     {
       "codecomabtName": "ICE-HKS-0056",
       "schoolName": "ST LOUIS SCHOOL",
       "creatorID": "61d29dd7f7358e11a026492d"
     },
     {
       "codecomabtName": "ICE-HKS-0057",
       "schoolName": "ST LOUIS SCHOOL",
       "creatorID": "61d29ddaf7358e11a026492e"
     },
     {
       "codecomabtName": "ICE-HKS-0058",
       "schoolName": "ST LOUIS SCHOOL",
       "creatorID": "61d29ddff7358e11a026492f"
     },
     {
       "codecomabtName": "ICE-HKS-0059",
       "schoolName": "ST LOUIS SCHOOL",
       "creatorID": "61d29de1f7358e11a0264930"
     },
     {
       "codecomabtName": "ICE-HKS-0060",
       "schoolName": "ST LOUIS SCHOOL",
       "creatorID": "61d29de4f7358e11a0264931"
     },
     {
       "codecomabtName": "ICE-HKS-0061",
       "schoolName": "ST JOAN OF ARC SECONDARY SCHOOL",
       "creatorID": "61d29de6f7358e11a0264932"
     },
     {
       "codecomabtName": "ICE-HKS-0062",
       "schoolName": "ST JOAN OF ARC SECONDARY SCHOOL",
       "creatorID": "61d29debf7358e11a0264933"
     },
     {
       "codecomabtName": "ICE-HKS-0063",
       "schoolName": "ST JOAN OF ARC SECONDARY SCHOOL",
       "creatorID": "61d29df0f7358e11a0264934"
     },
     {
       "codecomabtName": "ICE-HKS-0064",
       "schoolName": "ST JOAN OF ARC SECONDARY SCHOOL",
       "creatorID": "61d29df5f7358e11a0264935"
     },
     {
       "codecomabtName": "ICE-HKS-0065",
       "schoolName": "ST JOAN OF ARC SECONDARY SCHOOL",
       "creatorID": "61d29df7f7358e11a0264936"
     },
     {
       "codecomabtName": "ICE-HKS-0066",
       "schoolName": "ST JOAN OF ARC SECONDARY SCHOOL",
       "creatorID": "61d29dfaf7358e11a0264937"
     },
     {
       "codecomabtName": "ICE-HKS-0067",
       "schoolName": "ST JOAN OF ARC SECONDARY SCHOOL",
       "creatorID": "61d29dfcf7358e11a0264938"
     },
     {
       "codecomabtName": "ICE-HKS-0068",
       "schoolName": "ST JOAN OF ARC SECONDARY SCHOOL",
       "creatorID": "61d29dfff7358e11a0264939"
     },
     {
       "codecomabtName": "ICE-HKS-0069",
       "schoolName": "ST JOAN OF ARC SECONDARY SCHOOL",
       "creatorID": "61d29e04f7358e11a026493a"
     },
     {
       "codecomabtName": "ICE-HKS-0070",
       "schoolName": "HENRIETTA SECONDARY SCHOOL",
       "creatorID": "61d29e06f7358e11a026493b"
     },
     {
       "codecomabtName": "ICE-HKS-0071",
       "schoolName": "HENRIETTA SECONDARY SCHOOL",
       "creatorID": "61d29e09f7358e11a026493c"
     },
     {
       "codecomabtName": "ICE-HKS-0072",
       "schoolName": "HENRIETTA SECONDARY SCHOOL",
       "creatorID": "61d29e0cf7358e11a026493d"
     },
     {
       "codecomabtName": "ICE-HKS-0073",
       "schoolName": "HENRIETTA SECONDARY SCHOOL",
       "creatorID": "61d29e10f7358e11a026493e"
     },
     {
       "codecomabtName": "ICE-HKS-0074",
       "schoolName": "HENRIETTA SECONDARY SCHOOL",
       "creatorID": "61d29e15f7358e11a026493f"
     },
     {
       "codecomabtName": "ICE-HKS-0075",
       "schoolName": "HENRIETTA SECONDARY SCHOOL",
       "creatorID": "61d29e17f7358e11a0264940"
     },
     {
       "codecomabtName": "ICE-HKS-0076",
       "schoolName": "HENRIETTA SECONDARY SCHOOL",
       "creatorID": "61d29e19f7358e11a0264941"
     },
     {
       "codecomabtName": "ICE-HKS-0077",
       "schoolName": "HENRIETTA SECONDARY SCHOOL",
       "creatorID": "61d29e1cf7358e11a0264942"
     },
     {
       "codecomabtName": "ICE-HKS-0078",
       "schoolName": "HENRIETTA SECONDARY SCHOOL",
       "creatorID": "61d29e1ff7358e11a0264943"
     },
     {
       "codecomabtName": "ICE-HKS-0079",
       "schoolName": "HENRIETTA SECONDARY SCHOOL",
       "creatorID": "61d29e21f7358e11a0264944"
     },
     {
       "codecomabtName": "ICE-HKS-0080",
       "schoolName": "HENRIETTA SECONDARY SCHOOL",
       "creatorID": "61d29e24f7358e11a0264945"
     },
     {
       "codecomabtName": "ICE-HKS-0081",
       "schoolName": "HENRIETTA SECONDARY SCHOOL",
       "creatorID": "61d29e27f7358e11a0264946"
     },
     {
       "codecomabtName": "ICE-HKS-0082",
       "schoolName": "HENRIETTA SECONDARY SCHOOL",
       "creatorID": "61d29e2bf7358e11a0264947"
     },
     {
       "codecomabtName": "ICE-HKS-0083",
       "schoolName": "St. Stephen's Church College",
       "creatorID": "61d29e2ef7358e11a0264948"
     },
     {
       "codecomabtName": "ICE-HKS-0084",
       "schoolName": "St. Stephen's Girls' College",
       "creatorID": "61d29e34f7358e11a0264949"
     },
     {
       "codecomabtName": "ICE-HKS-0085",
       "schoolName": "St. Stephen's Girls' College",
       "creatorID": "61d29e37f7358e11a026494a"
     },
     {
       "codecomabtName": "ICE-HKS-0086",
       "schoolName": "St. Stephen's Girls' College",
       "creatorID": "61d29e3af7358e11a026494b"
     },
     {
       "codecomabtName": "ICE-HKS-0087",
       "schoolName": "St. Stephen's Girls' College",
       "creatorID": "61d29e3df7358e11a026494c"
     },
     {
       "codecomabtName": "ICE-HKS-0088",
       "schoolName": "St. Stephen's Girls' College",
       "creatorID": "61d29e40f7358e11a026494d"
     },
     {
       "codecomabtName": "ICE-HKS-0089",
       "schoolName": "St. Stephen's Girls' College",
       "creatorID": "61d29e43f7358e11a026494e"
     },
     {
       "codecomabtName": "ICE-HKS-0090",
       "schoolName": "St. Stephen's Girls' College",
       "creatorID": "61d29e46f7358e11a026494f"
     },
     {
       "codecomabtName": "ICE-HKS-0091",
       "schoolName": "St. Stephen's Girls' College",
       "creatorID": "61d29e49f7358e11a0264950"
     },
     {
       "codecomabtName": "ICE-HKS-0092",
       "schoolName": "KOREAN INTERNATIONAL SCHOOL (SECONDARY)",
       "creatorID": "61d29e4df7358e11a0264951"
     },
     {
       "codecomabtName": "ICE-HKS-0093",
       "schoolName": "WAH YAN COLLEGE, HONG KONG",
       "creatorID": "61d29e52f7358e11a0264952"
     },
     {
       "codecomabtName": "ICE-HKS-0094",
       "schoolName": "ST STEPHEN'S COLLEGE",
       "creatorID": "61d29e54f7358e11a0264953"
     },
     {
       "codecomabtName": "ICE-HKS-0095",
       "schoolName": "KING'S COLLEGE",
       "creatorID": "61d29e58f7358e11a0264954"
     },
     {
       "codecomabtName": "ICE-HKS-0096",
       "schoolName": "SOUTH ISLAND SCHOOL",
       "creatorID": "61d29e5af7358e11a0264955"
     },
     {
       "codecomabtName": "ICE-HKS-0097",
       "schoolName": "ST PAUL'S CO-EDUCATIONAL COLLEGE",
       "creatorID": "61d29e5df7358e11a0264956"
     },
     {
       "codecomabtName": "ICE-HKS-0098",
       "schoolName": "SKH TANG SHIU KIN SECONDARY SCHOOL",
       "creatorID": "61d29e61f7358e11a0264957"
     },
     {
       "codecomabtName": "ICE-HKS-0099",
       "schoolName": "SKH TANG SHIU KIN SECONDARY SCHOOL",
       "creatorID": "61d29e64f7358e11a0264958"
     },
     {
       "codecomabtName": "ICE-HKS-0100",
       "schoolName": "SKH TANG SHIU KIN SECONDARY SCHOOL",
       "creatorID": "61d29e6af7358e11a0264959"
     },
     {
       "codecomabtName": "ICE-HKS-0101",
       "schoolName": "SKH TANG SHIU KIN SECONDARY SCHOOL",
       "creatorID": "61d29e6ef7358e11a026495a"
     },
     {
       "codecomabtName": "ICE-HKS-0102",
       "schoolName": "SKH TANG SHIU KIN SECONDARY SCHOOL",
       "creatorID": "61d29e74f7358e11a026495b"
     },
     {
       "codecomabtName": "ICE-HKS-0103",
       "schoolName": "SKH TANG SHIU KIN SECONDARY SCHOOL",
       "creatorID": "61d29e77f7358e11a026495c"
     },
     {
       "codecomabtName": "ICE-HKS-0104",
       "schoolName": "SKH TANG SHIU KIN SECONDARY SCHOOL",
       "creatorID": "61d29e7af7358e11a026495d"
     },
     {
       "codecomabtName": "ICE-HKS-0105",
       "schoolName": "SKH TANG SHIU KIN SECONDARY SCHOOL",
       "creatorID": "61d29e7ef7358e11a026495e"
     },
     {
       "codecomabtName": "ICE-HKS-0106",
       "schoolName": "SKH TANG SHIU KIN SECONDARY SCHOOL",
       "creatorID": "61d29e81f7358e11a026495f"
     },
     {
       "codecomabtName": "ICE-HKS-0107",
       "schoolName": "SKH TANG SHIU KIN SECONDARY SCHOOL",
       "creatorID": "61d29e85f7358e11a0264960"
     },
     {
       "codecomabtName": "ICE-HKS-0108",
       "schoolName": "SKH TANG SHIU KIN SECONDARY SCHOOL",
       "creatorID": "61d29e87f7358e11a0264961"
     },
     {
       "codecomabtName": "ICE-HKS-0109",
       "schoolName": "SKH TANG SHIU KIN SECONDARY SCHOOL",
       "creatorID": "61d29e8af7358e11a0264962"
     },
     {
      "codecomabtName": "ICE-HKP-0110",
      "schoolName": "ST JOSEPH'S PRIMARY SCHOOL",
      "creatorID": "61d29e8df7358e11a0264963"
    },
    {
      "codecomabtName": "ICE-HKS-0160",
      "schoolName": "St. Stephen's Church College",
      "creatorID": "61d29f34f7358e11a0264995"
    },
    {
      "codecomabtName": "ICE-HKS-0161",
      "schoolName": "St. Stephen's Church College",
      "creatorID": "61d29f37f7358e11a0264996"
    },
    {
      "codecomabtName": "ICE-HKS-0162",
      "schoolName": "St. Stephen's Church College",
      "creatorID": "61d29f3af7358e11a0264997"
    },
    {
      "codecomabtName": "ICE-HKS-0163",
      "schoolName": "St. Stephen's Church College",
      "creatorID": "61d29f3df7358e11a0264998"
    },
    {
      "codecomabtName": "ICE-HKS-0164",
      "schoolName": "St. Stephen's Church College",
      "creatorID": "61d29f40f7358e11a0264999"
    },
    {
      "codecomabtName": "ICE-HKS-0165",
      "schoolName": "St. Stephen's Church College",
      "creatorID": "61d29f43f7358e11a026499a"
    },
    {
      "codecomabtName": "ICE-HKS-0166",
      "schoolName": "St. Stephen's Church College",
      "creatorID": "61d29f46f7358e11a026499b"
    },
    {
      "codecomabtName": "ICE-HKS-0167",
      "schoolName": "St. Stephen's Church College",
      "creatorID": "61d29f49f7358e11a026499c"
    },
    {
      "codecomabtName": "ICE-HKS-0168",
      "schoolName": "St. Stephen's Church College",
      "creatorID": "61d29f4cf7358e11a026499d"
    },
    {
      "codecomabtName": "ICE-HKS-0169",
      "schoolName": "St. Stephen's Church College",
      "creatorID": "61d29f4ff7358e11a026499e"
    },
    {
      "codecomabtName": "ICE-HKS-0170",
      "schoolName": "St. Stephen's Church College",
      "creatorID": "61d29f52f7358e11a026499f"
    },
    {
      "codecomabtName": "ICE-HKS-0171",
      "schoolName": "ST PAUL'S COLLEGE",
      "creatorID": "61d29f55f7358e11a02649a0"
    }
    ];


  hdata.map((d) => {
    let student = HKschoolData.filter(
      (x) => x.creatorID === d.creator
    )[0];

    if (student) {
      
        hRankings.push({
          name: d.creatorName,
          schoolName: student.schoolName,
          score: Math.round(d.leagues[0].stats.totalScore * 100),
          
        });
        oRankings.push({
          name: d.creatorName,
          schoolName: student.schoolName,
          score: Math.round(d.leagues[0].stats.totalScore * 100),
          
        });
      }
  });
  const kres = await fetch(
    `https://codecombat.com/db/level/5fca06dc8b4da8002889dbf1/rankings?order=-1&scoreOffset=1000000&team=humans&leagues.leagueID=61d39c5bf4636d064c6f5de4&limit=100`
  );
  const kdata = await kres.json();
  

  const KLNschoolData = [
   
     {
       "codecomabtName": "ICE-KLNP-0210",
       "schoolName": "BISHOP WALSH PRIMARY SCHOOL",
       "creatorID": "61d29766f7358e11a0264751"
     },
     {
       "codecomabtName": "ICE-KLNP-0211",
       "schoolName": "BISHOP WALSH PRIMARY SCHOOL",
       "creatorID": "61d2976cf7358e11a0264752"
     },
     {
       "codecomabtName": "ICE-KLNP-0212",
       "schoolName": "BISHOP WALSH PRIMARY SCHOOL",
       "creatorID": "61d2976ff7358e11a0264753"
     },
     {
       "codecomabtName": "ICE-KLNP-0213",
       "schoolName": "BISHOP WALSH PRIMARY SCHOOL",
       "creatorID": "61d29772f7358e11a0264754"
     },
     {
       "codecomabtName": "ICE-KLNP-0214",
       "schoolName": "BISHOP WALSH PRIMARY SCHOOL",
       "creatorID": "61d29775f7358e11a0264755"
     },
     {
       "codecomabtName": "ICE-KLNP-0215",
       "schoolName": "BISHOP WALSH PRIMARY SCHOOL",
       "creatorID": "61d29778f7358e11a0264756"
     },
     {
       "codecomabtName": "ICE-KLNP-0216",
       "schoolName": "BISHOP WALSH PRIMARY SCHOOL",
       "creatorID": "61d2977df7358e11a0264757"
     },
     {
       "codecomabtName": "ICE-KLNP-0217",
       "schoolName": "BISHOP WALSH PRIMARY SCHOOL",
       "creatorID": "61d29780f7358e11a0264758"
     },
     {
       "codecomabtName": "ICE-KLNP-0218",
       "schoolName": "BISHOP WALSH PRIMARY SCHOOL",
       "creatorID": "61d29782f7358e11a0264759"
     },
     {
       "codecomabtName": "ICE-KLNP-0219",
       "schoolName": "BISHOP WALSH PRIMARY SCHOOL",
       "creatorID": "61d29786f7358e11a026475a"
     },
     {
       "codecomabtName": "ICE-KLNP-0220",
       "schoolName": "BISHOP WALSH PRIMARY SCHOOL",
       "creatorID": "61d2978af7358e11a026475b"
     },
     {
       "codecomabtName": "ICE-KLNP-0221",
       "schoolName": "BISHOP WALSH PRIMARY SCHOOL",
       "creatorID": "61d2978cf7358e11a026475c"
     },
     {
       "codecomabtName": "ICE-KLNP-0222",
       "schoolName": "ALLIANCE PRIMARY SCHOOL,WHAMPOA",
       "creatorID": "61d29791f7358e11a026475d"
     },
     {
       "codecomabtName": "ICE-KLNP-0223",
       "schoolName": "ALLIANCE PRIMARY SCHOOL,WHAMPOA",
       "creatorID": "61d29793f7358e11a026475e"
     },
     {
       "codecomabtName": "ICE-KLNP-0224",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d29796f7358e11a026475f"
     },
     {
       "codecomabtName": "ICE-KLNP-0225",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d29799f7358e11a0264760"
     },
     {
       "codecomabtName": "ICE-KLNP-0226",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d2979ef7358e11a0264761"
     },
     {
       "codecomabtName": "ICE-KLNP-0227",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d297a1f7358e11a0264762"
     },
     {
       "codecomabtName": "ICE-KLNP-0228",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d297a6f7358e11a0264763"
     },
     {
       "codecomabtName": "ICE-KLNP-0229",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d297a8f7358e11a0264764"
     },
     {
       "codecomabtName": "ICE-KLNP-0230",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d297abf7358e11a0264765"
     },
     {
       "codecomabtName": "ICE-KLNP-0231",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d297aef7358e11a0264766"
     },
     {
       "codecomabtName": "ICE-KLNP-0232",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d297b1f7358e11a0264767"
     },
     {
       "codecomabtName": "ICE-KLNP-0233",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d297b5f7358e11a0264768"
     },
     {
       "codecomabtName": "ICE-KLNP-0234",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d297b7f7358e11a0264769"
     },
     {
       "codecomabtName": "ICE-KLNP-0235",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d297bbf7358e11a026476a"
     },
     {
       "codecomabtName": "ICE-KLNP-0236",
       "schoolName": "Tak Sun School",
       "creatorID": "61d297bef7358e11a026476b"
     },
     {
       "codecomabtName": "ICE-KLNP-0237",
       "schoolName": "Tak Sun School",
       "creatorID": "61d297c4f7358e11a026476c"
     },
     {
       "codecomabtName": "ICE-KLNP-0238",
       "schoolName": "Tak Sun School",
       "creatorID": "61d297c7f7358e11a026476d"
     },
     {
       "codecomabtName": "ICE-KLNP-0239",
       "schoolName": "Tak Sun School",
       "creatorID": "61d297c9f7358e11a026476e"
     },
     {
       "codecomabtName": "ICE-KLNP-0240",
       "schoolName": "Tak Sun School",
       "creatorID": "61d297cdf7358e11a026476f"
     },
     {
       "codecomabtName": "ICE-KLNP-0241",
       "schoolName": "Tak Sun School",
       "creatorID": "61d297d0f7358e11a0264770"
     },
     {
       "codecomabtName": "ICE-KLNP-0242",
       "schoolName": "Tak Sun School",
       "creatorID": "61d297d3f7358e11a0264771"
     },
     {
       "codecomabtName": "ICE-KLNP-0243",
       "schoolName": "Tak Sun School",
       "creatorID": "61d297d5f7358e11a0264772"
     },
     {
       "codecomabtName": "ICE-KLNP-0244",
       "schoolName": "Tak Sun School",
       "creatorID": "61d297d7f7358e11a0264773"
     },
     {
       "codecomabtName": "ICE-KLNP-0245",
       "schoolName": "Tak Sun School",
       "creatorID": "61d297dbf7358e11a0264774"
     },
     {
       "codecomabtName": "ICE-KLNP-0246",
       "schoolName": "Tak Sun School",
       "creatorID": "61d297dff7358e11a0264775"
     },
     {
       "codecomabtName": "ICE-KLNP-0247",
       "schoolName": "Tak Sun School",
       "creatorID": "61d297e2f7358e11a0264776"
     },
     {
       "codecomabtName": "ICE-KLNP-0248",
       "schoolName": "Po Leung Kuk Camões Tan Siu Lin Primary School",
       "creatorID": "61d297e4f7358e11a0264777"
     },
     {
       "codecomabtName": "ICE-KLNP-0249",
       "schoolName": "Po Leung Kuk Camões Tan Siu Lin Primary School",
       "creatorID": "61d297e7f7358e11a0264778"
     },
     {
       "codecomabtName": "ICE-KLNP-0250",
       "schoolName": "Po Leung Kuk Camões Tan Siu Lin Primary School",
       "creatorID": "61d297e9f7358e11a0264779"
     },
     {
       "codecomabtName": "ICE-KLNP-0251",
       "schoolName": "Po Leung Kuk Camões Tan Siu Lin Primary School",
       "creatorID": "61d297edf7358e11a026477a"
     },
     {
       "codecomabtName": "ICE-KLNP-0252",
       "schoolName": "Po Leung Kuk Camões Tan Siu Lin Primary School",
       "creatorID": "61d297eff7358e11a026477b"
     },
     {
       "codecomabtName": "ICE-KLNP-0253",
       "schoolName": "Po Leung Kuk Camões Tan Siu Lin Primary School",
       "creatorID": "61d297f2f7358e11a026477c"
     },
     {
       "codecomabtName": "ICE-KLNP-0254",
       "schoolName": "Po Leung Kuk Camões Tan Siu Lin Primary School",
       "creatorID": "61d297f6f7358e11a026477d"
     },
     {
       "codecomabtName": "ICE-KLNP-0255",
       "schoolName": "Po Leung Kuk Camões Tan Siu Lin Primary School",
       "creatorID": "61d297faf7358e11a026477e"
     },
     {
       "codecomabtName": "ICE-KLNP-0256",
       "schoolName": "Po Leung Kuk Camões Tan Siu Lin Primary School",
       "creatorID": "61d297fdf7358e11a026477f"
     },
     {
       "codecomabtName": "ICE-KLNP-0257",
       "schoolName": "Po Leung Kuk Camões Tan Siu Lin Primary School",
       "creatorID": "61d29800f7358e11a0264780"
     },
     {
       "codecomabtName": "ICE-KLNP-0258",
       "schoolName": "Po Leung Kuk Camões Tan Siu Lin Primary School",
       "creatorID": "61d29802f7358e11a0264781"
     },
     {
       "codecomabtName": "ICE-KLNP-0259",
       "schoolName": "Po Leung Kuk Camões Tan Siu Lin Primary School",
       "creatorID": "61d29806f7358e11a0264782"
     },
     {
       "codecomabtName": "ICE-KLNP-0260",
       "schoolName": "Po Leung Kuk Camões Tan Siu Lin Primary School",
       "creatorID": "61d2980bf7358e11a0264783"
     },
     {
       "codecomabtName": "ICE-KLNP-0261",
       "schoolName": "TAK NGA PRIMARY SCHOOL",
       "creatorID": "61d2980ff7358e11a0264784"
     },
     {
       "codecomabtName": "ICE-KLNP-0262",
       "schoolName": "TAK NGA PRIMARY SCHOOL",
       "creatorID": "61d29812f7358e11a0264785"
     },
     {
       "codecomabtName": "ICE-KLNP-0263",
       "schoolName": "TAK NGA PRIMARY SCHOOL",
       "creatorID": "61d29815f7358e11a0264786"
     },
     {
       "codecomabtName": "ICE-KLNP-0264",
       "schoolName": "TAK NGA PRIMARY SCHOOL",
       "creatorID": "61d2981af7358e11a0264787"
     },
     {
       "codecomabtName": "ICE-KLNP-0265",
       "schoolName": "TAK NGA PRIMARY SCHOOL",
       "creatorID": "61d2981df7358e11a0264788"
     },
     {
       "codecomabtName": "ICE-KLNP-0266",
       "schoolName": "TAK NGA PRIMARY SCHOOL",
       "creatorID": "61d29821f7358e11a0264789"
     },
     {
       "codecomabtName": "ICE-KLNP-0267",
       "schoolName": "TAK NGA PRIMARY SCHOOL",
       "creatorID": "61d29824f7358e11a026478a"
     },
     {
       "codecomabtName": "ICE-KLNP-0268",
       "schoolName": "TAK NGA PRIMARY SCHOOL",
       "creatorID": "61d29827f7358e11a026478b"
     },
     {
       "codecomabtName": "ICE-KLNP-0269",
       "schoolName": "TAK NGA PRIMARY SCHOOL",
       "creatorID": "61d2982cf7358e11a026478c"
     },
     {
       "codecomabtName": "ICE-KLNP-0270",
       "schoolName": "TAK NGA PRIMARY SCHOOL",
       "creatorID": "61d2982ff7358e11a026478d"
     },
     {
       "codecomabtName": "ICE-KLNP-0271",
       "schoolName": "Alliance Primary School, Kowloon Tong",
       "creatorID": "61d29831f7358e11a026478e"
     },
     {
       "codecomabtName": "ICE-KLNP-0272",
       "schoolName": "Alliance Primary School, Kowloon Tong",
       "creatorID": "61d29835f7358e11a026478f"
     },
     {
       "codecomabtName": "ICE-KLNP-0273",
       "schoolName": "Alliance Primary School, Kowloon Tong",
       "creatorID": "61d29838f7358e11a0264790"
     },
     {
       "codecomabtName": "ICE-KLNP-0274",
       "schoolName": "Alliance Primary School, Kowloon Tong",
       "creatorID": "61d2983af7358e11a0264791"
     },
     {
       "codecomabtName": "ICE-KLNP-0275",
       "schoolName": "Alliance Primary School, Kowloon Tong",
       "creatorID": "61d2983df7358e11a0264792"
     },
     {
       "codecomabtName": "ICE-KLNP-0276",
       "schoolName": "Alliance Primary School, Kowloon Tong",
       "creatorID": "61d29840f7358e11a0264793"
     },
     {
       "codecomabtName": "ICE-KLNP-0277",
       "schoolName": "CCC KEI WA PRIMARY SCHOOL (KOWLOON TONG)",
       "creatorID": "61d29844f7358e11a0264794"
     },
     {
       "codecomabtName": "ICE-KLNP-0278",
       "schoolName": "CCC KEI WA PRIMARY SCHOOL (KOWLOON TONG)",
       "creatorID": "61d29847f7358e11a0264795"
     },
     {
       "codecomabtName": "ICE-KLNP-0279",
       "schoolName": "CCC KEI WA PRIMARY SCHOOL (KOWLOON TONG)",
       "creatorID": "61d2984af7358e11a0264796"
     },
     {
       "codecomabtName": "ICE-KLNP-0280",
       "schoolName": "CCC KEI WA PRIMARY SCHOOL (KOWLOON TONG)",
       "creatorID": "61d2984cf7358e11a0264797"
     },
     {
       "codecomabtName": "ICE-KLNP-0281",
       "schoolName": "CCC KEI WA PRIMARY SCHOOL (KOWLOON TONG)",
       "creatorID": "61d29850f7358e11a0264798"
     },
     {
       "codecomabtName": "ICE-KLNP-0282",
       "schoolName": "CCC KEI WA PRIMARY SCHOOL (KOWLOON TONG)",
       "creatorID": "61d29852f7358e11a0264799"
     },
     {
       "codecomabtName": "ICE-KLNP-0283",
       "schoolName": "CCC KEI WA PRIMARY SCHOOL (KOWLOON TONG)",
       "creatorID": "61d29854f7358e11a026479a"
     },
     {
       "codecomabtName": "ICE-KLNP-0284",
       "schoolName": "CCC KEI WA PRIMARY SCHOOL (KOWLOON TONG)",
       "creatorID": "61d29858f7358e11a026479b"
     },
     {
       "codecomabtName": "ICE-KLNP-0285",
       "schoolName": "CCC KEI WA PRIMARY SCHOOL (KOWLOON TONG)",
       "creatorID": "61d2985bf7358e11a026479c"
     },
     {
       "codecomabtName": "ICE-KLNP-0286",
       "schoolName": "CCC KEI WA PRIMARY SCHOOL (KOWLOON TONG)",
       "creatorID": "61d2985df7358e11a026479d"
     },
     {
       "codecomabtName": "ICE-KLNP-0287",
       "schoolName": "CCC KEI WA PRIMARY SCHOOL (KOWLOON TONG)",
       "creatorID": "61d29860f7358e11a026479e"
     },
     {
       "codecomabtName": "ICE-KLNP-0288",
       "schoolName": "CCC KEI WA PRIMARY SCHOOL (KOWLOON TONG)",
       "creatorID": "61d29863f7358e11a026479f"
     },
     {
       "codecomabtName": "ICE-KLNP-0289",
       "schoolName": "CONFUCIAN TAI SHING PRIMARY SCHOOL",
       "creatorID": "61d29868f7358e11a02647a0"
     },
     {
       "codecomabtName": "ICE-KLNP-0290",
       "schoolName": "CONFUCIAN TAI SHING PRIMARY SCHOOL",
       "creatorID": "61d2986bf7358e11a02647a1"
     },
     {
       "codecomabtName": "ICE-KLNP-0291",
       "schoolName": "CONFUCIAN TAI SHING PRIMARY SCHOOL",
       "creatorID": "61d2986ef7358e11a02647a2"
     },
     {
       "codecomabtName": "ICE-KLNP-0292",
       "schoolName": "CONFUCIAN TAI SHING PRIMARY SCHOOL",
       "creatorID": "61d29872f7358e11a02647a3"
     },
     {
       "codecomabtName": "ICE-KLNP-0293",
       "schoolName": "CONFUCIAN TAI SHING PRIMARY SCHOOL",
       "creatorID": "61d29874f7358e11a02647a4"
     },
     {
       "codecomabtName": "ICE-KLNP-0294",
       "schoolName": "CONFUCIAN TAI SHING PRIMARY SCHOOL",
       "creatorID": "61d29876f7358e11a02647a5"
     },
     {
       "codecomabtName": "ICE-KLNP-0295",
       "schoolName": "CONFUCIAN TAI SHING PRIMARY SCHOOL",
       "creatorID": "61d29879f7358e11a02647a6"
     },
     {
       "codecomabtName": "ICE-KLNP-0296",
       "schoolName": "CONFUCIAN TAI SHING PRIMARY SCHOOL",
       "creatorID": "61d2987ef7358e11a02647a7"
     },
     {
       "codecomabtName": "ICE-KLNP-0297",
       "schoolName": "CONFUCIAN TAI SHING PRIMARY SCHOOL",
       "creatorID": "61d29881f7358e11a02647a8"
     },
     {
       "codecomabtName": "ICE-KLNP-0298",
       "schoolName": "CONFUCIAN TAI SHING PRIMARY SCHOOL",
       "creatorID": "61d29883f7358e11a02647a9"
     },
     {
       "codecomabtName": "ICE-KLNP-0299",
       "schoolName": "CONFUCIAN TAI SHING PRIMARY SCHOOL",
       "creatorID": "61d29886f7358e11a02647aa"
     },
     {
       "codecomabtName": "ICE-KLNP-0300",
       "schoolName": "CONFUCIAN TAI SHING PRIMARY SCHOOL",
       "creatorID": "61d2988bf7358e11a02647ab"
     },
     {
       "codecomabtName": "ICE-KLNP-0301",
       "schoolName": "CHAN'S CREATIVE SCHOOL",
       "creatorID": "61d2988ff7358e11a02647ac"
     },
     {
       "codecomabtName": "ICE-KLNP-0302",
       "schoolName": "CHAN'S CREATIVE SCHOOL",
       "creatorID": "61d29895f7358e11a02647ad"
     },
     {
       "codecomabtName": "ICE-KLNP-0303",
       "schoolName": "CHAN'S CREATIVE SCHOOL",
       "creatorID": "61d29898f7358e11a02647ae"
     },
     {
       "codecomabtName": "ICE-KLNP-0304",
       "schoolName": "CHAN'S CREATIVE SCHOOL",
       "creatorID": "61d2989bf7358e11a02647af"
     },
     {
       "codecomabtName": "ICE-KLNP-0305",
       "schoolName": "CHAN'S CREATIVE SCHOOL",
       "creatorID": "61d2989ef7358e11a02647b0"
     },
     {
       "codecomabtName": "ICE-KLNP-0306",
       "schoolName": "CHAN'S CREATIVE SCHOOL",
       "creatorID": "61d298a3f7358e11a02647b1"
     },
     {
       "codecomabtName": "ICE-KLNP-0307",
       "schoolName": "CHAN'S CREATIVE SCHOOL",
       "creatorID": "61d298a5f7358e11a02647b2"
     },
     {
       "codecomabtName": "ICE-KLNP-0308",
       "schoolName": "CHAN'S CREATIVE SCHOOL",
       "creatorID": "61d298a9f7358e11a02647b3"
     },
     {
       "codecomabtName": "ICE-KLNP-0309",
       "schoolName": "CHAN'S CREATIVE SCHOOL",
       "creatorID": "61d298acf7358e11a02647b4"
     },
     {
       "codecomabtName": "ICE-KLNP-0310",
       "schoolName": "Kowloon Bay St. John The Baptist Catholic Primary School",
       "creatorID": "61d298aff7358e11a02647b5"
     },
     {
       "codecomabtName": "ICE-KLNP-0311",
       "schoolName": "Kowloon Bay St. John The Baptist Catholic Primary School",
       "creatorID": "61d298b2f7358e11a02647b6"
     },
     {
       "codecomabtName": "ICE-KLNP-0312",
       "schoolName": "Kowloon Bay St. John The Baptist Catholic Primary School",
       "creatorID": "61d298b4f7358e11a02647b7"
     },
     {
       "codecomabtName": "ICE-KLNP-0313",
       "schoolName": "Kowloon Bay St. John The Baptist Catholic Primary School",
       "creatorID": "61d298b7f7358e11a02647b8"
     },
     {
       "codecomabtName": "ICE-KLNP-0314",
       "schoolName": "Kowloon Bay St. John The Baptist Catholic Primary School",
       "creatorID": "61d298baf7358e11a02647b9"
     },
     {
       "codecomabtName": "ICE-KLNP-0315",
       "schoolName": "Kowloon Bay St. John The Baptist Catholic Primary School",
       "creatorID": "61d298c1f7358e11a02647ba"
     },
     {
       "codecomabtName": "ICE-KLNP-0316",
       "schoolName": "Kowloon Bay St. John The Baptist Catholic Primary School",
       "creatorID": "61d298c3f7358e11a02647bb"
     },
     {
       "codecomabtName": "ICE-KLNP-0317",
       "schoolName": "Kowloon Bay St. John The Baptist Catholic Primary School",
       "creatorID": "61d298c5f7358e11a02647bc"
     },
     {
       "codecomabtName": "ICE-KLNP-0318",
       "schoolName": "Kowloon Bay St. John The Baptist Catholic Primary School",
       "creatorID": "61d298c7f7358e11a02647bd"
     },
     {
       "codecomabtName": "ICE-KLNP-0319",
       "schoolName": "FUKIEN SECONDARY SCHOOL AFFILIATED SCHOOL",
       "creatorID": "61d298ccf7358e11a02647be"
     },
     {
       "codecomabtName": "ICE-KLNP-0320",
       "schoolName": "SKH KOWLOON BAY KEI LOK PRIMARY SCHOOL",
       "creatorID": "61d298d1f7358e11a02647bf"
     },
     {
       "codecomabtName": "ICE-KLNP-0321",
       "schoolName": "BUDDHIST CHI KING PRIMARY SCHOOL",
       "creatorID": "61d298d3f7358e11a02647c0"
     },
     {
       "codecomabtName": "ICE-KLNP-0322",
       "schoolName": "YAUMATI CATHOLIC PRIMARY SCHOOL",
       "creatorID": "61d298d7f7358e11a02647c1"
     },
     {
       "codecomabtName": "ICE-KLNP-0323",
       "schoolName": "MA TAU CHUNG GOVERNMENT",
       "creatorID": "61d298d9f7358e11a02647c2"
     },
     {
       "codecomabtName": "ICE-KLNP-0324",
       "schoolName": "ST FRANCIS OF ASSISI'S ENGLISH PRIMARY SCHOOL",
       "creatorID": "61d298def7358e11a02647c3"
     },
     {
       "codecomabtName": "ICE-KLNP-0325",
       "schoolName": "ST FRANCIS OF ASSISI'S ENGLISH PRIMARY SCHOOL",
       "creatorID": "61d298e2f7358e11a02647c4"
     },
     {
       "codecomabtName": "ICE-KLNP-0326",
       "schoolName": "YING WA PRIMARY SCHOOL",
       "creatorID": "61d298e5f7358e11a02647c5"
     },
     {
       "codecomabtName": "ICE-KLNP-0327",
       "schoolName": "YING WA PRIMARY SCHOOL",
       "creatorID": "61d298e7f7358e11a02647c6"
     },
     {
       "codecomabtName": "ICE-KLNP-0328",
       "schoolName": "Home School 九龍區 under ICanCODE",
       "creatorID": "61d298e9f7358e11a02647c7"
     },
     {
       "codecomabtName": "ICE-KLNP-0329",
       "schoolName": "MA TAU CHUNG GOVERNMENT PRIMARY SCHOOL",
       "creatorID": "61d298edf7358e11a02647c8"
     },
     {
       "codecomabtName": "ICE-KLNP-0330",
       "schoolName": "SOCIETY OF BOYS' CTRS CHAK YAN CENTRE SCHOOL",
       "creatorID": "61d298f1f7358e11a02647c9"
     },
     {
       "codecomabtName": "ICE-KLNP-0331",
       "schoolName": "LING TO CATHOLIC PRIMARY SCHOOL",
       "creatorID": "61d298f4f7358e11a02647ca"
     },
     {
       "codecomabtName": "ICE-KLNP-0332",
       "schoolName": "SKH HOLY CROSS PRIMARY SCHOOL",
       "creatorID": "61d298fbf7358e11a02647cb"
     },
     {
       "codecomabtName": "ICE-KLNP-0333",
       "schoolName": "SKH GOOD SHEPHERD PRIMARY SCHOOL",
       "creatorID": "61d298fef7358e11a02647cc"
     },
     {
       "codecomabtName": "ICE-KLNP-0334",
       "schoolName": "TWGH LO YU CHIK PRIMARY SCHOOL",
       "creatorID": "61d29902f7358e11a02647cd"
     },
     {
       "codecomabtName": "ICE-KLNP-0335",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d29905f7358e11a02647ce"
     },
     {
       "codecomabtName": "ICE-KLNP-0336",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d29909f7358e11a02647cf"
     },
     {
       "codecomabtName": "ICE-KLNP-0337",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d2990cf7358e11a02647d0"
     },
     {
       "codecomabtName": "ICE-KLNP-0338",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d2990ff7358e11a02647d1"
     },
     {
       "codecomabtName": "ICE-KLNP-0339",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d29912f7358e11a02647d2"
     },
     {
       "codecomabtName": "ICE-KLNP-0340",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d29914f7358e11a02647d3"
     },
     {
       "codecomabtName": "ICE-KLNP-0341",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d29917f7358e11a02647d4"
     },
     {
       "codecomabtName": "ICE-KLNP-0342",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d2991af7358e11a02647d5"
     },
     {
       "codecomabtName": "ICE-KLNP-0343",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d2991ef7358e11a02647d6"
     },
     {
       "codecomabtName": "ICE-KLNP-0344",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d29922f7358e11a02647d7"
     },
     {
       "codecomabtName": "ICE-KLNP-0345",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d29925f7358e11a02647d8"
     },
     {
       "codecomabtName": "ICE-KLNP-0346",
       "schoolName": "Diocesan Boys' School Primary Division",
       "creatorID": "61d29928f7358e11a02647d9"
     },
     {
       "codecomabtName": "ICE-KLNP-0347",
       "schoolName": "FARM ROAD GOVERNMENT PRIMARY SCHOOL",
       "creatorID": "61d2992af7358e11a02647da"
     },
     {
       "codecomabtName": "ICE-KLNP-0348",
       "schoolName": "LA SALLE PRIMARY SCHOOL",
       "creatorID": "61d2992cf7358e11a02647db"
     },
     {
       "codecomabtName": "ICE-KLNP-0349",
       "schoolName": "ST JOSEPH'S ANGLO-CHINESE PRIMARY SCHOOL",
       "creatorID": "61d2992ff7358e11a02647dc"
     },
     {
       "codecomabtName": "ICE-KLNS-0350",
       "schoolName": " COGNITIO COLLEGE (KOWLOON)",
       "creatorID": "61d29932f7358e11a02647dd"
     },
     {
       "codecomabtName": "ICE-KLNS-0351",
       "schoolName": " COGNITIO COLLEGE (KOWLOON)",
       "creatorID": "61d29935f7358e11a02647de"
     },
     {
       "codecomabtName": "ICE-KLNS-0352",
       "schoolName": " COGNITIO COLLEGE (KOWLOON)",
       "creatorID": "61d29939f7358e11a02647df"
     },
     {
       "codecomabtName": "ICE-KLNS-0353",
       "schoolName": " COGNITIO COLLEGE (KOWLOON)",
       "creatorID": "61d2993bf7358e11a02647e0"
     },
     {
       "codecomabtName": "ICE-KLNS-0354",
       "schoolName": " COGNITIO COLLEGE (KOWLOON)",
       "creatorID": "61d2993ff7358e11a02647e1"
     },
     {
       "codecomabtName": "ICE-KLNS-0355",
       "schoolName": "WAH YAN COLLEGE, KOWLOON",
       "creatorID": "61d29942f7358e11a02647e2"
     },
     {
       "codecomabtName": "ICE-KLNS-0356",
       "schoolName": "WAH YAN COLLEGE, KOWLOON",
       "creatorID": "61d29945f7358e11a02647e3"
     },
     {
       "codecomabtName": "ICE-KLNS-0357",
       "schoolName": "WAH YAN COLLEGE, KOWLOON",
       "creatorID": "61d29949f7358e11a02647e4"
     },
     {
       "codecomabtName": "ICE-KLNS-0358",
       "schoolName": "WAH YAN COLLEGE, KOWLOON",
       "creatorID": "61d2994ff7358e11a02647e5"
     },
     {
       "codecomabtName": "ICE-KLNS-0359",
       "schoolName": "WAH YAN COLLEGE, KOWLOON",
       "creatorID": "61d29953f7358e11a02647e6"
     },
     {
       "codecomabtName": "ICE-KLNS-0360",
       "schoolName": "WAH YAN COLLEGE, KOWLOON",
       "creatorID": "61d29956f7358e11a02647e7"
     },
     {
       "codecomabtName": "ICE-KLNS-0361",
       "schoolName": "WAH YAN COLLEGE, KOWLOON",
       "creatorID": "61d29958f7358e11a02647e8"
     },
     {
       "codecomabtName": "ICE-KLNS-0362",
       "schoolName": "WAH YAN COLLEGE, KOWLOON",
       "creatorID": "61d2995bf7358e11a02647e9"
     },
     {
       "codecomabtName": "ICE-KLNS-0363",
       "schoolName": "WAH YAN COLLEGE, KOWLOON",
       "creatorID": "61d2995ff7358e11a02647ea"
     },
     {
       "codecomabtName": "ICE-KLNS-0364",
       "schoolName": "WAH YAN COLLEGE, KOWLOON",
       "creatorID": "61d29962f7358e11a02647eb"
     },
     {
       "codecomabtName": "ICE-KLNS-0365",
       "schoolName": "WAH YAN COLLEGE, KOWLOON",
       "creatorID": "61d29964f7358e11a02647ec"
     },
     {
       "codecomabtName": "ICE-KLNS-0366",
       "schoolName": "WAH YAN COLLEGE, KOWLOON",
       "creatorID": "61d29967f7358e11a02647ed"
     },
     {
       "codecomabtName": "ICE-KLNS-0367",
       "schoolName": "DIOCESAN GIRLS' SCHOOL",
       "creatorID": "61d2996bf7358e11a02647ee"
     },
     {
       "codecomabtName": "ICE-KLNS-0368",
       "schoolName": "DIOCESAN GIRLS' SCHOOL",
       "creatorID": "61d29970f7358e11a02647ef"
     },
     {
       "codecomabtName": "ICE-KLNS-0370",
       "schoolName": "ELCHK LUTHERAN SECONDARY SCHOOL",
       "creatorID": "61d29973f7358e11a02647f0"
     },
     {
       "codecomabtName": "ICE-KLNS-0371",
       "schoolName": "ELCHK LUTHERAN SECONDARY SCHOOL",
       "creatorID": "61d29975f7358e11a02647f1"
     },
     {
       "codecomabtName": "ICE-KLNS-0372",
       "schoolName": "MU KUANG ENGLISH SCHOOL",
       "creatorID": "61d29978f7358e11a02647f2"
     },
     {
       "codecomabtName": "ICE-KLNS-0373",
       "schoolName": "MU KUANG ENGLISH SCHOOL",
       "creatorID": "61d2997bf7358e11a02647f3"
     },
     {
       "codecomabtName": "ICE-KLNS-0374",
       "schoolName": "MU KUANG ENGLISH SCHOOL",
       "creatorID": "61d2997ff7358e11a02647f4"
     },
     {
       "codecomabtName": "ICE-KLNS-0375",
       "schoolName": "MU KUANG ENGLISH SCHOOL",
       "creatorID": "61d29981f7358e11a02647f5"
     },
     {
       "codecomabtName": "ICE-KLNS-0376",
       "schoolName": "MU KUANG ENGLISH SCHOOL",
       "creatorID": "61d29986f7358e11a02647f6"
     },
     {
       "codecomabtName": "ICE-KLNS-0377",
       "schoolName": "MU KUANG ENGLISH SCHOOL",
       "creatorID": "61d29988f7358e11a02647f7"
     },
     {
       "codecomabtName": "ICE-KLNS-0378",
       "schoolName": "MU KUANG ENGLISH SCHOOL",
       "creatorID": "61d2998bf7358e11a02647f8"
     },
     {
       "codecomabtName": "ICE-KLNS-0379",
       "schoolName": "MU KUANG ENGLISH SCHOOL",
       "creatorID": "61d2998ef7358e11a02647f9"
     },
     {
       "codecomabtName": "ICE-KLNS-0380",
       "schoolName": "MU KUANG ENGLISH SCHOOL",
       "creatorID": "61d29990f7358e11a02647fa"
     },
     {
       "codecomabtName": "ICE-KLNS-0381",
       "schoolName": "MU KUANG ENGLISH SCHOOL",
       "creatorID": "61d29993f7358e11a02647fb"
     },
     {
       "codecomabtName": "ICE-KLNS-0382",
       "schoolName": "MU KUANG ENGLISH SCHOOL",
       "creatorID": "61d29995f7358e11a02647fc"
     },
     {
       "codecomabtName": "ICE-KLNS-0383",
       "schoolName": "MU KUANG ENGLISH SCHOOL",
       "creatorID": "61d29998f7358e11a02647fd"
     },
     {
       "codecomabtName": "ICE-KLNS-0384",
       "schoolName": "HKSYC&IA WONG TAI SHAN MEMORIAL COLLEGE",
       "creatorID": "61d2999df7358e11a02647fe"
     },
     {
       "codecomabtName": "ICE-KLNS-0385",
       "schoolName": "HKSYC&IA WONG TAI SHAN MEMORIAL COLLEGE",
       "creatorID": "61d2999ff7358e11a02647ff"
     },
     {
       "codecomabtName": "ICE-KLNS-0386",
       "schoolName": "HKSYC&IA WONG TAI SHAN MEMORIAL COLLEGE",
       "creatorID": "61d299a2f7358e11a0264800"
     },
     {
       "codecomabtName": "ICE-KLNS-0387",
       "schoolName": "HKSYC&IA WONG TAI SHAN MEMORIAL COLLEGE",
       "creatorID": "61d299a7f7358e11a0264801"
     },
     {
       "codecomabtName": "ICE-KLNS-0388",
       "schoolName": "KOWLOON TONG SCHOOL (SECONDARY SECTION)",
       "creatorID": "61d299abf7358e11a0264802"
     },
     {
       "codecomabtName": "ICE-KLNS-0389",
       "schoolName": "KOWLOON TONG SCHOOL (SECONDARY SECTION)",
       "creatorID": "61d299aff7358e11a0264803"
     },
     {
       "codecomabtName": "ICE-KLNS-0390",
       "schoolName": "KOWLOON TONG SCHOOL (SECONDARY SECTION)",
       "creatorID": "61d299b3f7358e11a0264804"
     },
     {
       "codecomabtName": "ICE-KLNS-0391",
       "schoolName": "KOWLOON TONG SCHOOL (SECONDARY SECTION)",
       "creatorID": "61d299b7f7358e11a0264805"
     },
     {
       "codecomabtName": "ICE-KLNS-0392",
       "schoolName": "KOWLOON TONG SCHOOL (SECONDARY SECTION)",
       "creatorID": "61d299bbf7358e11a0264806"
     },
     {
       "codecomabtName": "ICE-KLNS-0393",
       "schoolName": "KOWLOON TONG SCHOOL (SECONDARY SECTION)",
       "creatorID": "61d299bdf7358e11a0264807"
     },
     {
       "codecomabtName": "ICE-KLNS-0394",
       "schoolName": "KOWLOON TONG SCHOOL (SECONDARY SECTION)",
       "creatorID": "61d299c0f7358e11a0264808"
     },
     {
       "codecomabtName": "ICE-KLNS-0395",
       "schoolName": "KOWLOON TONG SCHOOL (SECONDARY SECTION)",
       "creatorID": "61d299c2f7358e11a0264809"
     },
     {
       "codecomabtName": "ICE-KLNS-0396",
       "schoolName": "KOWLOON TONG SCHOOL (SECONDARY SECTION)",
       "creatorID": "61d299c4f7358e11a026480a"
     },
     {
       "codecomabtName": "ICE-KLNS-0397",
       "schoolName": "KOWLOON TONG SCHOOL (SECONDARY SECTION)",
       "creatorID": "61d299c8f7358e11a026480b"
     },
     {
       "codecomabtName": "ICE-KLNS-0398",
       "schoolName": "NEWMAN CATHOLIC COLLEGE",
       "creatorID": "61d299caf7358e11a026480c"
     },
     {
       "codecomabtName": "ICE-KLNS-0399",
       "schoolName": "NEWMAN CATHOLIC COLLEGE",
       "creatorID": "61d299cff7358e11a026480d"
     },
     {
       "codecomabtName": "ICE-KLNS-0400",
       "schoolName": "NEWMAN CATHOLIC COLLEGE",
       "creatorID": "61d299d3f7358e11a026480e"
     },
     {
       "codecomabtName": "ICE-KLNS-0401",
       "schoolName": "NEWMAN CATHOLIC COLLEGE",
       "creatorID": "61d299d6f7358e11a026480f"
     },
     {
       "codecomabtName": "ICE-KLNS-0402",
       "schoolName": "NEWMAN CATHOLIC COLLEGE",
       "creatorID": "61d299daf7358e11a0264810"
     },
     {
       "codecomabtName": "ICE-KLNS-0403",
       "schoolName": "NEWMAN CATHOLIC COLLEGE",
       "creatorID": "61d299dff7358e11a0264811"
     },
     {
       "codecomabtName": "ICE-KLNS-0404",
       "schoolName": "NEWMAN CATHOLIC COLLEGE",
       "creatorID": "61d299e2f7358e11a0264812"
     },
     {
       "codecomabtName": "ICE-KLNS-0405",
       "schoolName": "NEWMAN CATHOLIC COLLEGE",
       "creatorID": "61d299e5f7358e11a0264813"
     },
     {
       "codecomabtName": "ICE-KLNS-0406",
       "schoolName": "NEWMAN CATHOLIC COLLEGE",
       "creatorID": "61d299e9f7358e11a0264814"
     },
     {
       "codecomabtName": "ICE-KLNS-0407",
       "schoolName": "NEWMAN CATHOLIC COLLEGE",
       "creatorID": "61d299ebf7358e11a0264815"
     },
     {
       "codecomabtName": "ICE-KLNS-0408",
       "schoolName": "NEWMAN CATHOLIC COLLEGE",
       "creatorID": "61d299eff7358e11a0264816"
     },
     {
       "codecomabtName": "ICE-KLNS-0409",
       "schoolName": "International Christian Quality Music Secondary and Primary School",
       "creatorID": "61d299f1f7358e11a0264817"
     },
     {
       "codecomabtName": "ICE-KLNS-0410",
       "schoolName": "International Christian Quality Music Secondary and Primary School",
       "creatorID": "61d299f4f7358e11a0264818"
     },
     {
       "codecomabtName": "ICE-KLNS-0411",
       "schoolName": "International Christian Quality Music Secondary and Primary School",
       "creatorID": "61d299f6f7358e11a0264819"
     },
     {
       "codecomabtName": "ICE-KLNS-0412",
       "schoolName": "International Christian Quality Music Secondary and Primary School",
       "creatorID": "61d299f9f7358e11a026481a"
     },
     {
       "codecomabtName": "ICE-KLNS-0413",
       "schoolName": "BISHOP HALL JUBILEE SCHOOL",
       "creatorID": "61d299fef7358e11a026481b"
     },
     {
       "codecomabtName": "ICE-KLNS-0414",
       "schoolName": "BISHOP HALL JUBILEE SCHOOL",
       "creatorID": "61d29a00f7358e11a026481c"
     },
     {
       "codecomabtName": "ICE-KLNS-0415",
       "schoolName": "BISHOP HALL JUBILEE SCHOOL",
       "creatorID": "61d29a04f7358e11a026481d"
     },
     {
       "codecomabtName": "ICE-KLNS-0416",
       "schoolName": "BISHOP HALL JUBILEE SCHOOL",
       "creatorID": "61d29a06f7358e11a026481e"
     },
     {
       "codecomabtName": "ICE-KLNS-0417",
       "schoolName": "BISHOP HALL JUBILEE SCHOOL",
       "creatorID": "61d29a08f7358e11a026481f"
     },
     {
       "codecomabtName": "ICE-KLNS-0418",
       "schoolName": "BISHOP HALL JUBILEE SCHOOL",
       "creatorID": "61d29a0df7358e11a0264820"
     },
     {
       "codecomabtName": "ICE-KLNS-0419",
       "schoolName": "BISHOP HALL JUBILEE SCHOOL",
       "creatorID": "61d29a11f7358e11a0264821"
     },
     {
       "codecomabtName": "ICE-KLNS-0420",
       "schoolName": "BISHOP HALL JUBILEE SCHOOL",
       "creatorID": "61d29a18f7358e11a0264822"
     },
     {
       "codecomabtName": "ICE-KLNS-0421",
       "schoolName": "BISHOP HALL JUBILEE SCHOOL",
       "creatorID": "61d29a1cf7358e11a0264823"
     },
     {
       "codecomabtName": "ICE-KLNS-0422",
       "schoolName": "BISHOP HALL JUBILEE SCHOOL",
       "creatorID": "61d29a20f7358e11a0264824"
     },
     {
       "codecomabtName": "ICE-KLNS-0423",
       "schoolName": "BISHOP HALL JUBILEE SCHOOL",
       "creatorID": "61d29a22f7358e11a0264825"
     },
     {
       "codecomabtName": "ICE-KLNS-0424",
       "schoolName": "BISHOP HALL JUBILEE SCHOOL",
       "creatorID": "61d29a25f7358e11a0264826"
     },
     {
       "codecomabtName": "ICE-KLNS-0425",
       "schoolName": "BISHOP HALL JUBILEE SCHOOL",
       "creatorID": "61d29a2af7358e11a0264827"
     },
     {
       "codecomabtName": "ICE-KLNS-0426",
       "schoolName": "BISHOP HALL JUBILEE SCHOOL",
       "creatorID": "61d29a2ef7358e11a0264828"
     },
     {
       "codecomabtName": "ICE-KLNS-0427",
       "schoolName": "BISHOP HALL JUBILEE SCHOOL",
       "creatorID": "61d29a31f7358e11a0264829"
     },
     {
       "codecomabtName": "ICE-KLNS-0428",
       "schoolName": "BISHOP HALL JUBILEE SCHOOL",
       "creatorID": "61d29a35f7358e11a026482a"
     },
     {
       "codecomabtName": "ICE-KLNS-0429",
       "schoolName": "BISHOP HALL JUBILEE SCHOOL",
       "creatorID": "61d29a37f7358e11a026482b"
     },
     {
       "codecomabtName": "ICE-KLNS-0430",
       "schoolName": "METHODIST COLLEGE",
       "creatorID": "61d29a39f7358e11a026482c"
     },
     {
       "codecomabtName": "ICE-KLNS-0431",
       "schoolName": "METHODIST COLLEGE",
       "creatorID": "61d29a3cf7358e11a026482d"
     },
     {
       "codecomabtName": "ICE-KLNS-0432",
       "schoolName": "METHODIST COLLEGE",
       "creatorID": "61d29a3ef7358e11a026482e"
     },
     {
       "codecomabtName": "ICE-KLNS-0433",
       "schoolName": "METHODIST COLLEGE",
       "creatorID": "61d29a41f7358e11a026482f"
     },
     {
       "codecomabtName": "ICE-KLNS-0434",
       "schoolName": "METHODIST COLLEGE",
       "creatorID": "61d29a44f7358e11a0264830"
     },
     {
       "codecomabtName": "ICE-KLNS-0435",
       "schoolName": "METHODIST COLLEGE",
       "creatorID": "61d29a47f7358e11a0264831"
     },
     {
       "codecomabtName": "ICE-KLNS-0436",
       "schoolName": "METHODIST COLLEGE",
       "creatorID": "61d29a4af7358e11a0264832"
     },
     {
       "codecomabtName": "ICE-KLNS-0437",
       "schoolName": "METHODIST COLLEGE",
       "creatorID": "61d29a4df7358e11a0264833"
     },
     {
       "codecomabtName": "ICE-KLNS-0438",
       "schoolName": "METHODIST COLLEGE",
       "creatorID": "61d29a4ff7358e11a0264834"
     },
     {
       "codecomabtName": "ICE-KLNS-0439",
       "schoolName": "METHODIST COLLEGE",
       "creatorID": "61d29a56f7358e11a0264835"
     },
     {
       "codecomabtName": "ICE-KLNS-0440",
       "schoolName": "METHODIST COLLEGE",
       "creatorID": "61d29a5af7358e11a0264836"
     },
     {
       "codecomabtName": "ICE-KLNS-0441",
       "schoolName": "METHODIST COLLEGE",
       "creatorID": "61d29a5df7358e11a0264837"
     },
     {
       "codecomabtName": "ICE-KLNS-0442",
       "schoolName": "PUI CHING MIDDLE SCHOOL",
       "creatorID": "61d29a61f7358e11a0264838"
     },
     {
       "codecomabtName": "ICE-KLNS-0443",
       "schoolName": "PUI CHING MIDDLE SCHOOL",
       "creatorID": "61d29a64f7358e11a0264839"
     },
     {
       "codecomabtName": "ICE-KLNS-0444",
       "schoolName": "PUI CHING MIDDLE SCHOOL",
       "creatorID": "61d29a66f7358e11a026483a"
     },
     {
       "codecomabtName": "ICE-KLNS-0445",
       "schoolName": "PUI CHING MIDDLE SCHOOL",
       "creatorID": "61d29a68f7358e11a026483b"
     },
     {
       "codecomabtName": "ICE-KLNS-0446",
       "schoolName": "PUI CHING MIDDLE SCHOOL",
       "creatorID": "61d29a6df7358e11a026483c"
     },
     {
       "codecomabtName": "ICE-KLNS-0447",
       "schoolName": "PUI CHING MIDDLE SCHOOL",
       "creatorID": "61d29a72f7358e11a026483d"
     },
     {
       "codecomabtName": "ICE-KLNS-0448",
       "schoolName": "PUI CHING MIDDLE SCHOOL",
       "creatorID": "61d29a75f7358e11a026483e"
     },
     {
       "codecomabtName": "ICE-KLNS-0449",
       "schoolName": "PUI CHING MIDDLE SCHOOL",
       "creatorID": "61d29a79f7358e11a026483f"
     },
     {
       "codecomabtName": "ICE-KLNS-0450",
       "schoolName": "PUI CHING MIDDLE SCHOOL",
       "creatorID": "61d29a7ef7358e11a0264840"
     },
     {
       "codecomabtName": "ICE-KLNS-0451",
       "schoolName": "PUI CHING MIDDLE SCHOOL",
       "creatorID": "61d29a84f7358e11a0264841"
     },
     {
       "codecomabtName": "ICE-KLNS-0452",
       "schoolName": "PUI CHING MIDDLE SCHOOL",
       "creatorID": "61d29a8af7358e11a0264842"
     },
     {
       "codecomabtName": "ICE-KLNS-0453",
       "schoolName": "PUI CHING MIDDLE SCHOOL",
       "creatorID": "61d29a8cf7358e11a0264843"
     },
     {
       "codecomabtName": "ICE-KLNS-0454",
       "schoolName": "DIOCESAN BOYS' SCHOOL",
       "creatorID": "61d29a8ff7358e11a0264844"
     },
     {
       "codecomabtName": "ICE-KLNS-0455",
       "schoolName": "DIOCESAN BOYS' SCHOOL",
       "creatorID": "61d29a95f7358e11a0264845"
     },
     {
       "codecomabtName": "ICE-KLNS-0456",
       "schoolName": "DIOCESAN BOYS' SCHOOL",
       "creatorID": "61d29a97f7358e11a0264846"
     },
     {
       "codecomabtName": "ICE-KLNS-0457",
       "schoolName": "DIOCESAN BOYS' SCHOOL",
       "creatorID": "61d29a9bf7358e11a0264847"
     },
     {
       "codecomabtName": "ICE-KLNS-0458",
       "schoolName": "DIOCESAN BOYS' SCHOOL",
       "creatorID": "61d29a9ff7358e11a0264848"
     },
     {
       "codecomabtName": "ICE-KLNS-0459",
       "schoolName": "DIOCESAN BOYS' SCHOOL",
       "creatorID": "61d29aa2f7358e11a0264849"
     },
     {
       "codecomabtName": "ICE-KLNS-0460",
       "schoolName": "DIOCESAN BOYS' SCHOOL",
       "creatorID": "61d29aa5f7358e11a026484a"
     },
     {
       "codecomabtName": "ICE-KLNS-0461",
       "schoolName": "DIOCESAN BOYS' SCHOOL",
       "creatorID": "61d29aa9f7358e11a026484b"
     },
     {
       "codecomabtName": "ICE-KLNS-0462",
       "schoolName": "DIOCESAN BOYS' SCHOOL",
       "creatorID": "61d29aacf7358e11a026484c"
     },
     {
       "codecomabtName": "ICE-KLNS-0463",
       "schoolName": "DIOCESAN BOYS' SCHOOL",
       "creatorID": "61d29ab1f7358e11a026484d"
     },
     {
       "codecomabtName": "ICE-KLNS-0464",
       "schoolName": "DIOCESAN BOYS' SCHOOL",
       "creatorID": "61d29ab4f7358e11a026484e"
     },
     {
       "codecomabtName": "ICE-KLNS-0465",
       "schoolName": "DIOCESAN BOYS' SCHOOL",
       "creatorID": "61d29ab9f7358e11a026484f"
     },
     {
       "codecomabtName": "ICE-KLNS-0466",
       "schoolName": "DIOCESAN BOYS' SCHOOL",
       "creatorID": "61d29abef7358e11a0264850"
     },
     {
       "codecomabtName": "ICE-KLNS-0467",
       "schoolName": "DIOCESAN BOYS' SCHOOL",
       "creatorID": "61d29ac1f7358e11a0264851"
     },
     {
       "codecomabtName": "ICE-KLNS-0468",
       "schoolName": "NING PO NO.2 COLLEGE",
       "creatorID": "61d29ac5f7358e11a0264852"
     },
     {
       "codecomabtName": "ICE-KLNS-0469",
       "schoolName": "NING PO NO.2 COLLEGE",
       "creatorID": "61d29ac9f7358e11a0264853"
     },
     {
       "codecomabtName": "ICE-KLNS-0470",
       "schoolName": "NING PO NO.2 COLLEGE",
       "creatorID": "61d29acef7358e11a0264854"
     },
     {
       "codecomabtName": "ICE-KLNS-0471",
       "schoolName": "NING PO NO.2 COLLEGE",
       "creatorID": "61d29ad6f7358e11a0264855"
     },
     {
       "codecomabtName": "ICE-KLNS-0472",
       "schoolName": "NING PO NO.2 COLLEGE",
       "creatorID": "61d29ad9f7358e11a0264856"
     },
     {
       "codecomabtName": "ICE-KLNS-0473",
       "schoolName": "NING PO NO.2 COLLEGE",
       "creatorID": "61d29adff7358e11a0264857"
     },
     {
       "codecomabtName": "ICE-KLNS-0474",
       "schoolName": "NING PO NO.2 COLLEGE",
       "creatorID": "61d29ae5f7358e11a0264858"
     },
     {
       "codecomabtName": "ICE-KLNS-0475",
       "schoolName": "NING PO NO.2 COLLEGE",
       "creatorID": "61d29ae8f7358e11a0264859"
     },
     {
       "codecomabtName": "ICE-KLNS-0476",
       "schoolName": "NING PO NO.2 COLLEGE",
       "creatorID": "61d29aebf7358e11a026485a"
     },
     {
       "codecomabtName": "ICE-KLNS-0477",
       "schoolName": "NING PO NO.2 COLLEGE",
       "creatorID": "61d29af0f7358e11a026485b"
     },
     {
       "codecomabtName": "ICE-KLNS-0478",
       "schoolName": "KWUN TONG GOVERNMENT SECONDARY SCHOOL",
       "creatorID": "61d29af3f7358e11a026485c"
     },
     {
       "codecomabtName": "ICE-KLNS-0479",
       "schoolName": "JOCKEY CLUB GOVERNMENT SECONDARY SCHOOL",
       "creatorID": "61d29af6f7358e11a026485d"
     },
     {
       "codecomabtName": "ICE-KLNS-0480",
       "schoolName": "JOCKEY CLUB GOVERNMENT SECONDARY SCHOOL",
       "creatorID": "61d29af9f7358e11a026485e"
     },
     {
       "codecomabtName": "ICE-KLNS-0481",
       "schoolName": "JOCKEY CLUB GOVERNMENT SECONDARY SCHOOL",
       "creatorID": "61d29afbf7358e11a026485f"
     },
     {
       "codecomabtName": "ICE-KLNS-0482",
       "schoolName": "JOCKEY CLUB GOVERNMENT SECONDARY SCHOOL",
       "creatorID": "61d29afff7358e11a0264860"
     },
     {
       "codecomabtName": "ICE-KLNS-0483",
       "schoolName": "SING YIN SECONDARY SCHOOL",
       "creatorID": "61d29b03f7358e11a0264861"
     },
     {
       "codecomabtName": "ICE-KLNS-0484",
       "schoolName": "SING YIN SECONDARY SCHOOL",
       "creatorID": "61d29b05f7358e11a0264862"
     },
     {
       "codecomabtName": "ICE-KLNS-0485",
       "schoolName": "SING YIN SECONDARY SCHOOL",
       "creatorID": "61d29b09f7358e11a0264863"
     },
     {
       "codecomabtName": "ICE-KLNS-0486",
       "schoolName": "SING YIN SECONDARY SCHOOL",
       "creatorID": "61d29b0bf7358e11a0264864"
     },
     {
       "codecomabtName": "ICE-KLNS-0487",
       "schoolName": "SING YIN SECONDARY SCHOOL",
       "creatorID": "61d29b0ef7358e11a0264865"
     },
     {
       "codecomabtName": "ICE-KLNS-0488",
       "schoolName": "SING YIN SECONDARY SCHOOL",
       "creatorID": "61d29b10f7358e11a0264866"
     },
     {
       "codecomabtName": "ICE-KLNS-0489",
       "schoolName": "SING YIN SECONDARY SCHOOL",
       "creatorID": "61d29b14f7358e11a0264867"
     },
     {
       "codecomabtName": "ICE-KLNS-0490",
       "schoolName": "SING YIN SECONDARY SCHOOL",
       "creatorID": "61d29b17f7358e11a0264868"
     },
     {
       "codecomabtName": "ICE-KLNS-0491",
       "schoolName": "SING YIN SECONDARY SCHOOL",
       "creatorID": "61d29b1af7358e11a0264869"
     },
     {
       "codecomabtName": "ICE-KLNS-0492",
       "schoolName": "SING YIN SECONDARY SCHOOL",
       "creatorID": "61d29b1df7358e11a026486a"
     },
     {
       "codecomabtName": "ICE-KLNS-0493",
       "schoolName": "SING YIN SECONDARY SCHOOL",
       "creatorID": "61d29b21f7358e11a026486b"
     },
     {
       "codecomabtName": "ICE-KLNS-0494",
       "schoolName": "SING YIN SECONDARY SCHOOL",
       "creatorID": "61d29b26f7358e11a026486c"
     },
     {
       "codecomabtName": "ICE-KLNS-0495",
       "schoolName": "SING YIN SECONDARY SCHOOL",
       "creatorID": "61d29b2cf7358e11a026486d"
     },
     {
       "codecomabtName": "ICE-KLNS-0496",
       "schoolName": "YWCA HIOE TJO YOENG COLLEGE",
       "creatorID": "61d29b2ff7358e11a026486e"
     },
     {
       "codecomabtName": "ICE-KLNS-0497",
       "schoolName": "YWCA HIOE TJO YOENG COLLEGE",
       "creatorID": "61d29b32f7358e11a026486f"
     },
     {
       "codecomabtName": "ICE-KLNS-0498",
       "schoolName": "YWCA HIOE TJO YOENG COLLEGE",
       "creatorID": "61d29b36f7358e11a0264870"
     },
     {
       "codecomabtName": "ICE-KLNS-0499",
       "schoolName": "YWCA HIOE TJO YOENG COLLEGE",
       "creatorID": "61d29b3af7358e11a0264871"
     },
     {
       "codecomabtName": "ICE-KLNS-0500",
       "schoolName": "KWUN TONG MARYKNOLL COLLEGE",
       "creatorID": "61d29b3df7358e11a0264872"
     },
     {
       "codecomabtName": "ICE-KLNS-0501",
       "schoolName": "CCC MING YIN COLLEGE",
       "creatorID": "61d29b41f7358e11a0264873"
     },
     {
       "codecomabtName": "ICE-KLNS-0502",
       "schoolName": "CCC MING YIN COLLEGE",
       "creatorID": "61d29b44f7358e11a0264874"
     },
     {
       "codecomabtName": "ICE-KLNS-0503",
       "schoolName": "CCC MING YIN COLLEGE",
       "creatorID": "61d29b47f7358e11a0264875"
     },
     {
       "codecomabtName": "ICE-KLNS-0504",
       "schoolName": "CCC MING YIN COLLEGE",
       "creatorID": "61d29b4af7358e11a0264876"
     },
     {
       "codecomabtName": "ICE-KLNS-0505",
       "schoolName": "CCC MING YIN COLLEGE",
       "creatorID": "61d29b4ef7358e11a0264877"
     },
     {
       "codecomabtName": "ICE-KLNS-0506",
       "schoolName": "CCC MING YIN COLLEGE",
       "creatorID": "61d29b50f7358e11a0264878"
     },
     {
       "codecomabtName": "ICE-KLNS-0507",
       "schoolName": "CCC MING YIN COLLEGE",
       "creatorID": "61d29b56f7358e11a0264879"
     },
     {
       "codecomabtName": "ICE-KLNS-0508",
       "schoolName": "Hoi Ping Chamber of Commerce Secondary School",
       "creatorID": "61d29b5af7358e11a026487a"
     },
     {
       "codecomabtName": "ICE-KLNS-0509",
       "schoolName": "Hoi Ping Chamber of Commerce Secondary School",
       "creatorID": "61d29b5ff7358e11a026487b"
     },
     {
       "codecomabtName": "ICE-KLNS-0510",
       "schoolName": "Hoi Ping Chamber of Commerce Secondary School",
       "creatorID": "61d29b61f7358e11a026487c"
     },
     {
       "codecomabtName": "ICE-KLNS-0511",
       "schoolName": "Hoi Ping Chamber of Commerce Secondary School",
       "creatorID": "61d29b64f7358e11a026487d"
     },
     {
       "codecomabtName": "ICE-KLNS-0512",
       "schoolName": "YEW CHUNG INTERNATIONAL SCHOOL - SECONDARY\n",
       "creatorID": "61d29b67f7358e11a026487e"
     },
     {
       "codecomabtName": "ICE-KLNS-0513",
       "schoolName": "HEUNG TO MIDDLE SCHOOL",
       "creatorID": "61d29b6bf7358e11a026487f"
     },
     {
       "codecomabtName": "ICE-KLNS-0514",
       "schoolName": "SIR ELLIS KADOORIE SECONDARY SCHOOL (WEST KLN)",
       "creatorID": "61d29b6ff7358e11a0264880"
     },
     {
       "codecomabtName": "ICE-KLNS-0515",
       "schoolName": "STAMFORD AMERICAN SCHOOL HONG KONG (SECONDARY)",
       "creatorID": "61d29b75f7358e11a0264881"
     },
     {
       "codecomabtName": "ICE-KLNS-0516",
       "schoolName": "NORD ANGLIA INTERNATIONAL SCHOOL, HK (SECONDARY)",
       "creatorID": "61d29b79f7358e11a0264882"
     },
     {
       "codecomabtName": "ICE-KLNS-0517",
       "schoolName": "MUNSANG COLLEGE",
       "creatorID": "61d29b7bf7358e11a0264883"
     },
     {
       "codecomabtName": "ICE-KLNS-0518",
       "schoolName": "HEEP YUNN SCHOOL",
       "creatorID": "61d29b81f7358e11a0264884"
     },
     {
       "codecomabtName": "ICE-KLNS-0519",
       "schoolName": "LA SALLE COLLEGE",
       "creatorID": "61d29b85f7358e11a0264885"
     },
     {
       "codecomabtName": "ICE-KLNS-0520",
       "schoolName": "LA SALLE COLLEGE",
       "creatorID": "61d29b88f7358e11a0264886"
     },
     {
       "codecomabtName": "ICE-KLNS-0521",
       "schoolName": "SKH HOLY TRINITY CHURCH SECONDARY SCHOOL",
       "creatorID": "61d29b8df7358e11a0264887"
     },
     {
       "codecomabtName": "ICE-KLNS-0522",
       "schoolName": "SKH HOLY TRINITY CHURCH SECONDARY SCHOOL",
       "creatorID": "61d29b90f7358e11a0264888"
     },
     {
       "codecomabtName": "ICE-KLNS-0523",
       "schoolName": "SKH HOLY TRINITY CHURCH SECONDARY SCHOOL",
       "creatorID": "61d29b95f7358e11a0264889"
     },
     {
       "codecomabtName": "ICE-KLNS-0524",
       "schoolName": "SKH HOLY TRINITY CHURCH SECONDARY SCHOOL",
       "creatorID": "61d29b98f7358e11a026488a"
     },
     {
       "codecomabtName": "ICE-KLNS-0525",
       "schoolName": "SKH HOLY TRINITY CHURCH SECONDARY SCHOOL",
       "creatorID": "61d29b9af7358e11a026488b"
     },
     {
       "codecomabtName": "ICE-KLNS-0526",
       "schoolName": "SKH HOLY TRINITY CHURCH SECONDARY SCHOOL",
       "creatorID": "61d29b9cf7358e11a026488c"
     },
     {
       "codecomabtName": "ICE-KLNS-0527",
       "schoolName": "SKH HOLY TRINITY CHURCH SECONDARY SCHOOL",
       "creatorID": "61d29b9ff7358e11a026488d"
     },
     {
      "codecomabtName": "ICE-KLNS-0578",
      "schoolName": "KING GEORGE V SCHOOL",
      "creatorID": "61d29c61f7358e11a02648c0"
    }
    ];


  kdata.map((d) => {
    let student = KLNschoolData.filter(
      (x) => x.creatorID === d.creator
    )[0];

    if (student) {
      
        kRankings.push({
          name: d.creatorName,
          schoolName: student.schoolName,
          score: Math.round(d.leagues[0].stats.totalScore * 100),
          
        });
        oRankings.push({
          name: d.creatorName,
          schoolName: student.schoolName,
          score: Math.round(d.leagues[0].stats.totalScore * 100),
          
        });
      }
  });
  const nres = await fetch(
    `https://codecombat.com/db/level/5fca06dc8b4da8002889dbf1/rankings?order=-1&scoreOffset=1000000&team=humans&leagues.leagueID=61d39821f4636d064c6f5de3&limit=100`
  );
  const ndata = await nres.json();
  

  const NTschoolData = [
    
     {
       "codecomabtName": "ICE-NTP-0628",
       "schoolName": "HK & MACAU LUTHERAN CHURCH PRIMARY SCHOOL",
       "creatorID": "61d291b2f7358e11a02645bf"
     },
     {
       "codecomabtName": "ICE-NTP-0629",
       "schoolName": "PLK FONG WONG KAM CHUEN PRIMARY SCHOOL",
       "creatorID": "61d291b5f7358e11a02645c0"
     },
     {
       "codecomabtName": "ICE-NTP-0630",
       "schoolName": "PLK FONG WONG KAM CHUEN PRIMARY SCHOOL",
       "creatorID": "61d291b8f7358e11a02645c1"
     },
     {
       "codecomabtName": "ICE-NTP-0631",
       "schoolName": "Po Leung Kuk Luk Hing Too Primary School",
       "creatorID": "61d291bdf7358e11a02645c2"
     },
     {
       "codecomabtName": "ICE-NTP-0632",
       "schoolName": "Po Leung Kuk Luk Hing Too Primary School",
       "creatorID": "61d291c0f7358e11a02645c3"
     },
     {
       "codecomabtName": "ICE-NTP-0633",
       "schoolName": "Po Leung Kuk Luk Hing Too Primary School",
       "creatorID": "61d291c3f7358e11a02645c4"
     },
     {
       "codecomabtName": "ICE-NTP-0634",
       "schoolName": "Po Leung Kuk Luk Hing Too Primary School",
       "creatorID": "61d291c6f7358e11a02645c5"
     },
     {
       "codecomabtName": "ICE-NTP-0635",
       "schoolName": "Po Leung Kuk Luk Hing Too Primary School",
       "creatorID": "61d291caf7358e11a02645c6"
     },
     {
       "codecomabtName": "ICE-NTP-0636",
       "schoolName": "Po Leung Kuk Luk Hing Too Primary School",
       "creatorID": "61d291cff7358e11a02645c7"
     },
     {
       "codecomabtName": "ICE-NTP-0637",
       "schoolName": "Po Leung Kuk Luk Hing Too Primary School",
       "creatorID": "61d291d2f7358e11a02645c8"
     },
     {
       "codecomabtName": "ICE-NTP-0638",
       "schoolName": "Po Leung Kuk Luk Hing Too Primary School",
       "creatorID": "61d291d5f7358e11a02645c9"
     },
     {
       "codecomabtName": "ICE-NTP-0639",
       "schoolName": "Po Leung Kuk Luk Hing Too Primary School",
       "creatorID": "61d291d8f7358e11a02645ca"
     },
     {
       "codecomabtName": "ICE-NTP-0640",
       "schoolName": "TAI PO OLD MARKET PUBLIC SCHOOL",
       "creatorID": "61d291daf7358e11a02645cb"
     },
     {
       "codecomabtName": "ICE-NTP-0641",
       "schoolName": "TAI PO OLD MARKET PUBLIC SCHOOL",
       "creatorID": "61d291ddf7358e11a02645cc"
     },
     {
       "codecomabtName": "ICE-NTP-0643",
       "schoolName": "TAI PO OLD MARKET PUBLIC SCHOOL",
       "creatorID": "61d291e1f7358e11a02645cd"
     },
     {
       "codecomabtName": "ICE-NTP-0644",
       "schoolName": "TAI PO OLD MARKET PUBLIC SCHOOL",
       "creatorID": "61d291e3f7358e11a02645ce"
     },
     {
       "codecomabtName": "ICE-NTP-0645",
       "schoolName": "LEUNG KUI KAU LUTHERAN PRIMARY SCHOOL",
       "creatorID": "61d291e7f7358e11a02645cf"
     },
     {
       "codecomabtName": "ICE-NTP-0646",
       "schoolName": "LEUNG KUI KAU LUTHERAN PRIMARY SCHOOL",
       "creatorID": "61d291eaf7358e11a02645d0"
     },
     {
       "codecomabtName": "ICE-NTP-0647",
       "schoolName": "LEUNG KUI KAU LUTHERAN PRIMARY SCHOOL",
       "creatorID": "61d291eef7358e11a02645d1"
     },
     {
       "codecomabtName": "ICE-NTP-0648",
       "schoolName": "LEUNG KUI KAU LUTHERAN PRIMARY SCHOOL",
       "creatorID": "61d291f2f7358e11a02645d2"
     },
     {
       "codecomabtName": "ICE-NTP-0649",
       "schoolName": "LEUNG KUI KAU LUTHERAN PRIMARY SCHOOL",
       "creatorID": "61d291f5f7358e11a02645d3"
     },
     {
       "codecomabtName": "ICE-NTP-0650",
       "schoolName": "LEUNG KUI KAU LUTHERAN PRIMARY SCHOOL",
       "creatorID": "61d291f8f7358e11a02645d4"
     },
     {
       "codecomabtName": "ICE-NTP-0651",
       "schoolName": "LEUNG KUI KAU LUTHERAN PRIMARY SCHOOL",
       "creatorID": "61d291faf7358e11a02645d5"
     },
     {
       "codecomabtName": "ICE-NTP-0652",
       "schoolName": "LEUNG KUI KAU LUTHERAN PRIMARY SCHOOL",
       "creatorID": "61d291fef7358e11a02645d6"
     },
     {
       "codecomabtName": "ICE-NTP-0653",
       "schoolName": "LEUNG KUI KAU LUTHERAN PRIMARY SCHOOL",
       "creatorID": "61d29200f7358e11a02645d7"
     },
     {
       "codecomabtName": "ICE-NTP-0654",
       "schoolName": "LEUNG KUI KAU LUTHERAN PRIMARY SCHOOL",
       "creatorID": "61d29202f7358e11a02645d8"
     },
     {
       "codecomabtName": "ICE-NTP-0655",
       "schoolName": "LEUNG KUI KAU LUTHERAN PRIMARY SCHOOL",
       "creatorID": "61d29205f7358e11a02645d9"
     },
     {
       "codecomabtName": "ICE-NTP-0656",
       "schoolName": "AMERICAN SCHOOL HONG KONG (PRIMARY)\n",
       "creatorID": "61d29207f7358e11a02645da"
     },
     {
       "codecomabtName": "ICE-NTP-0657",
       "schoolName": "MA ON SHAN ST. JOSEPH'S PRIMARY SCHOOL",
       "creatorID": "61d2920af7358e11a02645db"
     },
     {
       "codecomabtName": "ICE-NTP-0658",
       "schoolName": "PLK SIU HON SUM PRIMARY SCHOOL",
       "creatorID": "61d2920ef7358e11a02645dc"
     },
     {
       "codecomabtName": "ICE-NTP-0659",
       "schoolName": "IMMACULATE HEART OF MARY SCHOOL",
       "creatorID": "61d29212f7358e11a02645dd"
     },
     {
       "codecomabtName": "ICE-NTP-0660",
       "schoolName": "IMMACULATE HEART OF MARY SCHOOL",
       "creatorID": "61d29215f7358e11a02645de"
     },
     {
       "codecomabtName": "ICE-NTP-0661",
       "schoolName": "SKH MA ON SHAN HOLY SPIRIT PRIMARY SCHOOL",
       "creatorID": "61d29219f7358e11a02645df"
     },
     {
       "codecomabtName": "ICE-NTP-0662",
       "schoolName": "SHATIN JUNIOR SCHOOL",
       "creatorID": "61d2921cf7358e11a02645e0"
     },
     {
       "codecomabtName": "ICE-NTP-0663",
       "schoolName": "PUI KIU COLLEGE (PRIMARY)",
       "creatorID": "61d2921ff7358e11a02645e1"
     },
     {
       "codecomabtName": "ICE-NTP-0664",
       "schoolName": "BAPTIST LUI MING CHOI PRIMARY SCHOOL",
       "creatorID": "61d29222f7358e11a02645e2"
     },
     {
       "codecomabtName": "ICE-NTP-0665",
       "schoolName": "YCH HO SIK NAM PRIMARY SCHOOL",
       "creatorID": "61d29226f7358e11a02645e3"
     },
     {
       "codecomabtName": "ICE-NTP-0666",
       "schoolName": "TWGH WONG SEE SUM PRIMARY",
       "creatorID": "61d2922bf7358e11a02645e4"
     },
     {
       "codecomabtName": "ICE-NTP-0667",
       "schoolName": "SKH YAN LAAP PRIMARY SCHOOL",
       "creatorID": "61d2922df7358e11a02645e5"
     },
     {
       "codecomabtName": "ICE-NTP-0668",
       "schoolName": "INVICTUS SCHOOL",
       "creatorID": "61d29230f7358e11a02645e6"
     },
     {
       "codecomabtName": "ICE-NTP-0669",
       "schoolName": "STFA LEUNG KIT WAH PRIMARY SCHOOL",
       "creatorID": "61d29233f7358e11a02645e7"
     },
     {
       "codecomabtName": "ICE-NTP-0670",
       "schoolName": "PLK LUK HING TOO PRIMARY SCHOOL",
       "creatorID": "61d29235f7358e11a02645e8"
     },
     {
       "codecomabtName": "ICE-NTP-0671",
       "schoolName": "AD&FD POHL LEUNG SING TAK SCHOOL",
       "creatorID": "61d29238f7358e11a02645e9"
     },
     {
       "codecomabtName": "ICE-NTP-0672",
       "schoolName": "CNEC LUI MING CHOI PRIMARY SCHOOL",
       "creatorID": "61d2923bf7358e11a02645ea"
     },
     {
       "codecomabtName": "ICE-NTP-0673",
       "schoolName": "HKBUAS WONG KAM FAI SECONDARY & PRIMARY SCHOOL (PRIMARY)",
       "creatorID": "61d2923df7358e11a02645eb"
     },
     {
      "codecomabtName": "ICE-NTP-0927",
      "schoolName": "HKBUAS WONG KAM FAI SECONDARY & PRIMARY SCHOOL (PRIMARY)",
      "creatorID": "61d295b3f7358e11a02646e9"
    },
     {
       "codecomabtName": "ICE-NTP-0674",
       "schoolName": "SKH HOLY SPIRIT PRIMARY SCHOOL",
       "creatorID": "61d2923ff7358e11a02645ec"
     },
     {
       "codecomabtName": "ICE-NTP-0675",
       "schoolName": "SKH LING OI PRIMARY SCHOOL",
       "creatorID": "61d29243f7358e11a02645ed"
     },
     {
       "codecomabtName": "ICE-NTS-0676",
       "schoolName": "TUNG WAN MOK LAW SHUI WAH SCHOOL",
       "creatorID": "61d29246f7358e11a02645ee"
     },
     {
       "codecomabtName": "ICE-NTS-0677",
       "schoolName": "TUNG WAN MOK LAW SHUI WAH SCHOOL",
       "creatorID": "61d29249f7358e11a02645ef"
     },
     {
       "codecomabtName": "ICE-NTS-0678",
       "schoolName": "TUNG WAN MOK LAW SHUI WAH SCHOOL",
       "creatorID": "61d2924cf7358e11a02645f0"
     },
     {
       "codecomabtName": "ICE-NTS-0679",
       "schoolName": "TUNG WAN MOK LAW SHUI WAH SCHOOL",
       "creatorID": "61d29251f7358e11a02645f1"
     },
     {
       "codecomabtName": "ICE-NTS-0680",
       "schoolName": "SAI KUNG SUNG TSUN CATH SCHOOL (SECONDARY SECT)",
       "creatorID": "61d29256f7358e11a02645f2"
     },
     {
       "codecomabtName": "ICE-NTS-0681",
       "schoolName": "SAI KUNG SUNG TSUN CATH SCHOOL (SECONDARY SECT)",
       "creatorID": "61d29259f7358e11a02645f3"
     },
     {
       "codecomabtName": "ICE-NTS-0682",
       "schoolName": "SAI KUNG SUNG TSUN CATH SCHOOL (SECONDARY SECT)",
       "creatorID": "61d2925cf7358e11a02645f4"
     },
     {
       "codecomabtName": "ICE-NTS-0683",
       "schoolName": "SAI KUNG SUNG TSUN CATH SCHOOL (SECONDARY SECT)",
       "creatorID": "61d2925ff7358e11a02645f5"
     },
     {
       "codecomabtName": "ICE-NTS-0684",
       "schoolName": "TUEN MUN GOVERNMENT SECONDARY SCHOOL",
       "creatorID": "61d29264f7358e11a02645f6"
     },
     {
       "codecomabtName": "ICE-NTS-0685",
       "schoolName": "LST Ku Chiu Man Secondary School",
       "creatorID": "61d29268f7358e11a02645f7"
     },
     {
       "codecomabtName": "ICE-NTS-0686",
       "schoolName": "SKH LAM WOO MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d2926af7358e11a02645f8"
     },
     {
       "codecomabtName": "ICE-NTS-0687",
       "schoolName": "SKH LAM WOO MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d2926df7358e11a02645f9"
     },
     {
       "codecomabtName": "ICE-NTS-0688",
       "schoolName": "SKH LAM WOO MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d2926ff7358e11a02645fa"
     },
     {
       "codecomabtName": "ICE-NTS-0689",
       "schoolName": "SKH LAM WOO MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d29272f7358e11a02645fb"
     },
     {
       "codecomabtName": "ICE-NTS-0690",
       "schoolName": "SKH LAM WOO MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d29278f7358e11a02645fc"
     },
     {
       "codecomabtName": "ICE-NTS-0691",
       "schoolName": "SKH LAM WOO MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d2927cf7358e11a02645fd"
     },
     {
       "codecomabtName": "ICE-NTS-0692",
       "schoolName": "SKH LAM WOO MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d2927ff7358e11a02645fe"
     },
     {
       "codecomabtName": "ICE-NTS-0693",
       "schoolName": "SKH LAM WOO MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d29282f7358e11a02645ff"
     },
     {
       "codecomabtName": "ICE-NTS-0694",
       "schoolName": "SKH LAM WOO MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d29285f7358e11a0264600"
     },
     {
       "codecomabtName": "ICE-NTS-0695",
       "schoolName": "SKH LAM WOO MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d29289f7358e11a0264601"
     },
     {
       "codecomabtName": "ICE-NTS-0696",
       "schoolName": "SKH LAM WOO MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d2928bf7358e11a0264602"
     },
     {
       "codecomabtName": "ICE-NTS-0697",
       "schoolName": "SKH LAM WOO MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d2928ff7358e11a0264603"
     },
     {
       "codecomabtName": "ICE-NTS-0698",
       "schoolName": "SKH LAM WOO MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d29292f7358e11a0264604"
     },
     {
       "codecomabtName": "ICE-NTS-0699",
       "schoolName": "FANLING KAU YAN COLLEGE",
       "creatorID": "61d29295f7358e11a0264605"
     },
     {
       "codecomabtName": "ICE-NTS-0700",
       "schoolName": "FANLING KAU YAN COLLEGE",
       "creatorID": "61d29297f7358e11a0264606"
     },
     {
       "codecomabtName": "ICE-NTS-0701",
       "schoolName": "FANLING KAU YAN COLLEGE",
       "creatorID": "61d2929af7358e11a0264607"
     },
     {
       "codecomabtName": "ICE-NTS-0702",
       "schoolName": "FANLING KAU YAN COLLEGE",
       "creatorID": "61d2929df7358e11a0264608"
     },
     {
       "codecomabtName": "ICE-NTS-0703",
       "schoolName": "FANLING KAU YAN COLLEGE",
       "creatorID": "61d292a2f7358e11a0264609"
     },
     {
       "codecomabtName": "ICE-NTS-0704",
       "schoolName": "FANLING KAU YAN COLLEGE",
       "creatorID": "61d292a5f7358e11a026460a"
     },
     {
       "codecomabtName": "ICE-NTS-0705",
       "schoolName": "FANLING KAU YAN COLLEGE",
       "creatorID": "61d292a7f7358e11a026460b"
     },
     {
       "codecomabtName": "ICE-NTS-0706",
       "schoolName": "FANLING KAU YAN COLLEGE",
       "creatorID": "61d292aaf7358e11a026460c"
     },
     {
       "codecomabtName": "ICE-NTS-0707",
       "schoolName": "FANLING KAU YAN COLLEGE",
       "creatorID": "61d292aef7358e11a026460d"
     },
     {
       "codecomabtName": "ICE-NTS-0708",
       "schoolName": "FANLING KAU YAN COLLEGE",
       "creatorID": "61d292b1f7358e11a026460e"
     },
     {
       "codecomabtName": "ICE-NTS-0709",
       "schoolName": "FANLING KAU YAN COLLEGE",
       "creatorID": "61d292b4f7358e11a026460f"
     },
     {
       "codecomabtName": "ICE-NTS-0710",
       "schoolName": "FANLING KAU YAN COLLEGE",
       "creatorID": "61d292b6f7358e11a0264610"
     },
     {
       "codecomabtName": "ICE-NTS-0711",
       "schoolName": "Baptist Lui Ming Choi Secondary School",
       "creatorID": "61d292b9f7358e11a0264611"
     },
     {
       "codecomabtName": "ICE-NTS-0712",
       "schoolName": "Baptist Lui Ming Choi Secondary School",
       "creatorID": "61d292bbf7358e11a0264612"
     },
     {
       "codecomabtName": "ICE-NTS-0713",
       "schoolName": "Baptist Lui Ming Choi Secondary School",
       "creatorID": "61d292bef7358e11a0264613"
     },
     {
       "codecomabtName": "ICE-NTS-0714",
       "schoolName": "Baptist Lui Ming Choi Secondary School",
       "creatorID": "61d292c0f7358e11a0264614"
     },
     {
       "codecomabtName": "ICE-NTS-0715",
       "schoolName": "Baptist Lui Ming Choi Secondary School",
       "creatorID": "61d292c3f7358e11a0264615"
     },
     {
       "codecomabtName": "ICE-NTS-0716",
       "schoolName": "Baptist Lui Ming Choi Secondary School",
       "creatorID": "61d292c9f7358e11a0264616"
     },
     {
       "codecomabtName": "ICE-NTS-0717",
       "schoolName": "Baptist Lui Ming Choi Secondary School",
       "creatorID": "61d292cdf7358e11a0264617"
     },
     {
       "codecomabtName": "ICE-NTS-0718",
       "schoolName": "Baptist Lui Ming Choi Secondary School",
       "creatorID": "61d292d2f7358e11a0264618"
     },
     {
       "codecomabtName": "ICE-NTS-0719",
       "schoolName": "Baptist Lui Ming Choi Secondary School",
       "creatorID": "61d292d5f7358e11a0264619"
     },
     {
       "codecomabtName": "ICE-NTS-0720",
       "schoolName": "Baptist Lui Ming Choi Secondary School",
       "creatorID": "61d292d9f7358e11a026461a"
     },
     {
       "codecomabtName": "ICE-NTS-0721",
       "schoolName": "Baptist Lui Ming Choi Secondary School",
       "creatorID": "61d292ddf7358e11a026461b"
     },
     {
       "codecomabtName": "ICE-NTS-0722",
       "schoolName": "Baptist Lui Ming Choi Secondary School",
       "creatorID": "61d292e0f7358e11a026461c"
     },
     {
       "codecomabtName": "ICE-NTS-0723",
       "schoolName": "EVANGEL COLLEGE",
       "creatorID": "61d292e3f7358e11a026461d"
     },
     {
       "codecomabtName": "ICE-NTS-0724",
       "schoolName": "EVANGEL COLLEGE",
       "creatorID": "61d292e7f7358e11a026461e"
     },
     {
       "codecomabtName": "ICE-NTS-0725",
       "schoolName": "EVANGEL COLLEGE",
       "creatorID": "61d292ebf7358e11a026461f"
     },
     {
       "codecomabtName": "ICE-NTS-0726",
       "schoolName": "EVANGEL COLLEGE",
       "creatorID": "61d292eff7358e11a0264620"
     },
     {
       "codecomabtName": "ICE-NTS-0727",
       "schoolName": "EVANGEL COLLEGE",
       "creatorID": "61d292f2f7358e11a0264621"
     },
     {
       "codecomabtName": "ICE-NTS-0728",
       "schoolName": "EVANGEL COLLEGE",
       "creatorID": "61d292f5f7358e11a0264622"
     },
     {
       "codecomabtName": "ICE-NTS-0729",
       "schoolName": "EVANGEL COLLEGE",
       "creatorID": "61d292faf7358e11a0264623"
     },
     {
       "codecomabtName": "ICE-NTS-0730",
       "schoolName": "EVANGEL COLLEGE",
       "creatorID": "61d292fcf7358e11a0264624"
     },
     {
       "codecomabtName": "ICE-NTS-0731",
       "schoolName": "EVANGEL COLLEGE",
       "creatorID": "61d29300f7358e11a0264625"
     },
     {
       "codecomabtName": "ICE-NTS-0732",
       "schoolName": "EVANGEL COLLEGE",
       "creatorID": "61d29302f7358e11a0264626"
     },
     {
       "codecomabtName": "ICE-NTS-0733",
       "schoolName": "EVANGEL COLLEGE",
       "creatorID": "61d29304f7358e11a0264627"
     },
     {
       "codecomabtName": "ICE-NTS-0734",
       "schoolName": "EVANGEL COLLEGE",
       "creatorID": "61d29307f7358e11a0264628"
     },
     {
       "codecomabtName": "ICE-NTS-0735",
       "schoolName": "TWGHs Chen Zao Men College",
       "creatorID": "61d2930af7358e11a0264629"
     },
     {
       "codecomabtName": "ICE-NTS-0736",
       "schoolName": "TWGHs Chen Zao Men College",
       "creatorID": "61d2930cf7358e11a026462a"
     },
     {
       "codecomabtName": "ICE-NTS-0737",
       "schoolName": "TWGHs Chen Zao Men College",
       "creatorID": "61d29310f7358e11a026462b"
     },
     {
       "codecomabtName": "ICE-NTS-0738",
       "schoolName": "TWGHs Chen Zao Men College",
       "creatorID": "61d29314f7358e11a026462c"
     },
     {
       "codecomabtName": "ICE-NTS-0739",
       "schoolName": "PO LEUNG KUK LO KIT SING (1983) COLLEGE",
       "creatorID": "61d29318f7358e11a026462d"
     },
     {
       "codecomabtName": "ICE-NTS-0740",
       "schoolName": "PO LEUNG KUK LO KIT SING (1983) COLLEGE",
       "creatorID": "61d2931bf7358e11a026462e"
     },
     {
       "codecomabtName": "ICE-NTS-0741",
       "schoolName": "PO LEUNG KUK LO KIT SING (1983) COLLEGE",
       "creatorID": "61d2931ef7358e11a026462f"
     },
     {
       "codecomabtName": "ICE-NTS-0742",
       "schoolName": "PO LEUNG KUK LO KIT SING (1983) COLLEGE",
       "creatorID": "61d29320f7358e11a0264630"
     },
     {
       "codecomabtName": "ICE-NTS-0743",
       "schoolName": "PO LEUNG KUK LO KIT SING (1983) COLLEGE",
       "creatorID": "61d29322f7358e11a0264631"
     },
     {
       "codecomabtName": "ICE-NTS-0744",
       "schoolName": "PO LEUNG KUK LO KIT SING (1983) COLLEGE",
       "creatorID": "61d29325f7358e11a0264632"
     },
     {
       "codecomabtName": "ICE-NTS-0745",
       "schoolName": "PO LEUNG KUK LO KIT SING (1983) COLLEGE",
       "creatorID": "61d2932af7358e11a0264633"
     },
     {
       "codecomabtName": "ICE-NTS-0746",
       "schoolName": "PO LEUNG KUK LO KIT SING (1983) COLLEGE",
       "creatorID": "61d2932ef7358e11a0264634"
     },
     {
       "codecomabtName": "ICE-NTS-0747",
       "schoolName": "PO LEUNG KUK LO KIT SING (1983) COLLEGE",
       "creatorID": "61d29333f7358e11a0264635"
     },
     {
       "codecomabtName": "ICE-NTS-0748",
       "schoolName": "PO LEUNG KUK LO KIT SING (1983) COLLEGE",
       "creatorID": "61d29336f7358e11a0264636"
     },
     {
       "codecomabtName": "ICE-NTS-0749",
       "schoolName": "PO LEUNG KUK LO KIT SING (1983) COLLEGE",
       "creatorID": "61d2933af7358e11a0264637"
     },
     {
       "codecomabtName": "ICE-NTS-0750",
       "schoolName": "PO LEUNG KUK LO KIT SING (1983) COLLEGE",
       "creatorID": "61d2933df7358e11a0264638"
     },
     {
       "codecomabtName": "ICE-NTS-0751",
       "schoolName": "CONFUCIUS HALL SECONDARY SCHOOL",
       "creatorID": "61d29340f7358e11a0264639"
     },
     {
       "codecomabtName": "ICE-NTS-0752",
       "schoolName": "IMMACULATE HEART OF MARY COLLEGE",
       "creatorID": "61d29343f7358e11a026463a"
     },
     {
       "codecomabtName": "ICE-NTS-0753",
       "schoolName": "IMMACULATE HEART OF MARY COLLEGE",
       "creatorID": "61d29349f7358e11a026463b"
     },
     {
       "codecomabtName": "ICE-NTS-0754",
       "schoolName": "IMMACULATE HEART OF MARY COLLEGE",
       "creatorID": "61d2934ef7358e11a026463c"
     },
     {
       "codecomabtName": "ICE-NTS-0755",
       "schoolName": "TWGH CY MA MEMORIAL COLLEGE",
       "creatorID": "61d29352f7358e11a026463d"
     },
     {
       "codecomabtName": "ICE-NTS-0756",
       "schoolName": "TWGH CY MA MEMORIAL COLLEGE",
       "creatorID": "61d29355f7358e11a026463e"
     },
     {
       "codecomabtName": "ICE-NTS-0757",
       "schoolName": "SHATIN COLLEGE",
       "creatorID": "61d2935af7358e11a026463f"
     },
     {
       "codecomabtName": "ICE-NTS-0758",
       "schoolName": "SHATIN COLLEGE",
       "creatorID": "61d2935df7358e11a0264640"
     },
     {
       "codecomabtName": "ICE-NTS-0759",
       "schoolName": "SHATIN COLLEGE",
       "creatorID": "61d29362f7358e11a0264641"
     },
     {
       "codecomabtName": "ICE-NTP-0760",
       "schoolName": "SHATIN COLLEGE",
       "creatorID": "61d29364f7358e11a0264642"
     },
     {
       "codecomabtName": "ICE-NTS-0761",
       "schoolName": "SHATIN COLLEGE",
       "creatorID": "61d29366f7358e11a0264643"
     },
     {
       "codecomabtName": "ICE-NTS-0762",
       "schoolName": "SHATIN COLLEGE",
       "creatorID": "61d29369f7358e11a0264644"
     },
     {
       "codecomabtName": "ICE-NTS-0763",
       "schoolName": "HKMA K S LO COLLEGE",
       "creatorID": "61d2936df7358e11a0264645"
     },
     {
       "codecomabtName": "ICE-NTS-0764",
       "schoolName": "HKMA K S LO COLLEGE",
       "creatorID": "61d29370f7358e11a0264646"
     },
     {
       "codecomabtName": "ICE-NTS-0765",
       "schoolName": "HKMA K S LO COLLEGE",
       "creatorID": "61d29372f7358e11a0264647"
     },
     {
       "codecomabtName": "ICE-NTS-0766",
       "schoolName": "HKMA K S LO COLLEGE",
       "creatorID": "61d29376f7358e11a0264648"
     },
     {
       "codecomabtName": "ICE-NTS-0767",
       "schoolName": "HKMA K S LO COLLEGE",
       "creatorID": "61d29379f7358e11a0264649"
     },
     {
       "codecomabtName": "ICE-NTS-0768",
       "schoolName": "HKMA K S LO COLLEGE",
       "creatorID": "61d2937cf7358e11a026464a"
     },
     {
       "codecomabtName": "ICE-NTS-0769",
       "schoolName": "HKMA K S LO COLLEGE",
       "creatorID": "61d2937ff7358e11a026464b"
     },
     {
       "codecomabtName": "ICE-NTS-0770",
       "schoolName": "HKMA K S LO COLLEGE",
       "creatorID": "61d29386f7358e11a026464c"
     },
     {
       "codecomabtName": "ICE-NTS-0771",
       "schoolName": "HKMA K S LO COLLEGE",
       "creatorID": "61d2938af7358e11a026464d"
     },
     {
       "codecomabtName": "ICE-NTS-0772",
       "schoolName": "HKMA K S LO COLLEGE",
       "creatorID": "61d2938df7358e11a026464e"
     },
     {
       "codecomabtName": "ICE-NTS-0773",
       "schoolName": "HKMA K S LO COLLEGE",
       "creatorID": "61d2938ff7358e11a026464f"
     },
     {
       "codecomabtName": "ICE-NTS-0774",
       "schoolName": "HKMA K S LO COLLEGE",
       "creatorID": "61d29393f7358e11a0264650"
     },
     {
       "codecomabtName": "ICE-NTS-0775",
       "schoolName": "LINGNAN DR CHUNG WING KWONG MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d29395f7358e11a0264651"
     },
     {
       "codecomabtName": "ICE-NTS-0776",
       "schoolName": "LINGNAN DR CHUNG WING KWONG MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d29398f7358e11a0264652"
     },
     {
       "codecomabtName": "ICE-NTS-0777",
       "schoolName": "LINGNAN DR CHUNG WING KWONG MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d2939af7358e11a0264653"
     },
     {
       "codecomabtName": "ICE-NTS-0778",
       "schoolName": "HO YU COLLEGE & PRIMARY (SPONSORED BY SIK SIK YUEN)",
       "creatorID": "61d2939df7358e11a0264654"
     },
     {
       "codecomabtName": "ICE-NTS-0779",
       "schoolName": "HO YU COLLEGE & PRIMARY (SPONSORED BY SIK SIK YUEN)",
       "creatorID": "61d293a0f7358e11a0264655"
     },
     {
       "codecomabtName": "ICE-NTS-0780",
       "schoolName": "HO YU COLLEGE & PRIMARY (SPONSORED BY SIK SIK YUEN)",
       "creatorID": "61d293a2f7358e11a0264656"
     },
     {
       "codecomabtName": "ICE-NTS-0781",
       "schoolName": "HO YU COLLEGE & PRIMARY (SPONSORED BY SIK SIK YUEN)",
       "creatorID": "61d293a5f7358e11a0264657"
     },
     {
       "codecomabtName": "ICE-NTS-0782",
       "schoolName": "HO YU COLLEGE & PRIMARY (SPONSORED BY SIK SIK YUEN)",
       "creatorID": "61d293a8f7358e11a0264658"
     },
     {
       "codecomabtName": "ICE-NTS-0783",
       "schoolName": "HO YU COLLEGE & PRIMARY (SPONSORED BY SIK SIK YUEN)",
       "creatorID": "61d293abf7358e11a0264659"
     },
     {
       "codecomabtName": "ICE-NTS-0784",
       "schoolName": "HO YU COLLEGE & PRIMARY (SPONSORED BY SIK SIK YUEN)",
       "creatorID": "61d293b1f7358e11a026465a"
     },
     {
       "codecomabtName": "ICE-NTS-0785",
       "schoolName": "HO YU COLLEGE & PRIMARY (SPONSORED BY SIK SIK YUEN)",
       "creatorID": "61d293b5f7358e11a026465b"
     },
     {
       "codecomabtName": "ICE-NTS-0786",
       "schoolName": "HO YU COLLEGE & PRIMARY (SPONSORED BY SIK SIK YUEN)",
       "creatorID": "61d293baf7358e11a026465c"
     },
     {
       "codecomabtName": "ICE-NTS-0787",
       "schoolName": "HO YU COLLEGE & PRIMARY (SPONSORED BY SIK SIK YUEN)",
       "creatorID": "61d293bcf7358e11a026465d"
     },
     {
       "codecomabtName": "ICE-NTS-0788",
       "schoolName": "HO YU COLLEGE & PRIMARY (SPONSORED BY SIK SIK YUEN)",
       "creatorID": "61d293c0f7358e11a026465e"
     },
     {
       "codecomabtName": "ICE-NTS-0789",
       "schoolName": "HO YU COLLEGE & PRIMARY (SPONSORED BY SIK SIK YUEN)",
       "creatorID": "61d293c2f7358e11a026465f"
     },
     {
       "codecomabtName": "ICE-NTS-0790",
       "schoolName": "CARMEL PAK U SECONDARY SCHOOL",
       "creatorID": "61d293c8f7358e11a0264660"
     },
     {
       "codecomabtName": "ICE-NTS-0791",
       "schoolName": "CARMEL PAK U SECONDARY SCHOOL",
       "creatorID": "61d293ccf7358e11a0264661"
     },
     {
       "codecomabtName": "ICE-NTS-0792",
       "schoolName": "CARMEL PAK U SECONDARY SCHOOL",
       "creatorID": "61d293d0f7358e11a0264662"
     },
     {
       "codecomabtName": "ICE-NTS-0793",
       "schoolName": "CARMEL PAK U SECONDARY SCHOOL",
       "creatorID": "61d293d2f7358e11a0264663"
     },
     {
       "codecomabtName": "ICE-NTS-0794",
       "schoolName": "CARMEL PAK U SECONDARY SCHOOL",
       "creatorID": "61d293d5f7358e11a0264664"
     },
     {
       "codecomabtName": "ICE-NTS-0795",
       "schoolName": "CARMEL PAK U SECONDARY SCHOOL",
       "creatorID": "61d293d7f7358e11a0264665"
     },
     {
       "codecomabtName": "ICE-NTS-0796",
       "schoolName": "CARMEL PAK U SECONDARY SCHOOL",
       "creatorID": "61d293daf7358e11a0264666"
     },
     {
       "codecomabtName": "ICE-NTS-0797",
       "schoolName": "CARMEL PAK U SECONDARY SCHOOL",
       "creatorID": "61d293ddf7358e11a0264667"
     },
     {
       "codecomabtName": "ICE-NTS-0798",
       "schoolName": "CARMEL PAK U SECONDARY SCHOOL",
       "creatorID": "61d293e1f7358e11a0264668"
     },
     {
       "codecomabtName": "ICE-NTS-0799",
       "schoolName": "CARMEL PAK U SECONDARY SCHOOL",
       "creatorID": "61d293e3f7358e11a0264669"
     },
     {
       "codecomabtName": "ICE-NTS-0800",
       "schoolName": "CARMEL PAK U SECONDARY SCHOOL",
       "creatorID": "61d293e6f7358e11a026466a"
     },
     {
       "codecomabtName": "ICE-NTS-0801",
       "schoolName": "CARMEL PAK U SECONDARY SCHOOL",
       "creatorID": "61d293eaf7358e11a026466b"
     },
     {
       "codecomabtName": "ICE-NTS-0802",
       "schoolName": "PLK YAO LING SUN COLLEGE",
       "creatorID": "61d293edf7358e11a026466c"
     },
     {
       "codecomabtName": "ICE-NTS-0803",
       "schoolName": "PLK YAO LING SUN COLLEGE",
       "creatorID": "61d293f0f7358e11a026466d"
     },
     {
       "codecomabtName": "ICE-NTS-0804",
       "schoolName": "PLK YAO LING SUN COLLEGE",
       "creatorID": "61d293f3f7358e11a026466e"
     },
     {
       "codecomabtName": "ICE-NTS-0805",
       "schoolName": "PLK YAO LING SUN COLLEGE",
       "creatorID": "61d293f5f7358e11a026466f"
     },
     {
       "codecomabtName": "ICE-NTS-0806",
       "schoolName": "PLK YAO LING SUN COLLEGE",
       "creatorID": "61d293f7f7358e11a0264670"
     },
     {
       "codecomabtName": "ICE-NTS-0807",
       "schoolName": "PLK YAO LING SUN COLLEGE",
       "creatorID": "61d293faf7358e11a0264671"
     },
     {
       "codecomabtName": "ICE-NTS-0808",
       "schoolName": "PLK YAO LING SUN COLLEGE",
       "creatorID": "61d293fdf7358e11a0264672"
     },
     {
       "codecomabtName": "ICE-NTS-0809",
       "schoolName": "PLK YAO LING SUN COLLEGE",
       "creatorID": "61d29400f7358e11a0264673"
     },
     {
       "codecomabtName": "ICE-NTS-0810",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d29402f7358e11a0264674"
     },
     {
       "codecomabtName": "ICE-NTS-0811",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d29404f7358e11a0264675"
     },
     {
       "codecomabtName": "ICE-NTS-0812",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d2940af7358e11a0264676"
     },
     {
       "codecomabtName": "ICE-NTS-0813",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d2940df7358e11a0264677"
     },
     {
       "codecomabtName": "ICE-NTS-0814",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d29410f7358e11a0264678"
     },
     {
       "codecomabtName": "ICE-NTS-0815",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d29415f7358e11a0264679"
     },
     {
       "codecomabtName": "ICE-NTS-0816",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d2941bf7358e11a026467a"
     },
     {
       "codecomabtName": "ICE-NTS-0817",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d29420f7358e11a026467b"
     },
     {
       "codecomabtName": "ICE-NTS-0818",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d29422f7358e11a026467c"
     },
     {
       "codecomabtName": "ICE-NTS-0819",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d29426f7358e11a026467d"
     },
     {
       "codecomabtName": "ICE-NTS-0820",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d29429f7358e11a026467e"
     },
     {
       "codecomabtName": "ICE-NTS-0821",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d2942ff7358e11a026467f"
     },
     {
       "codecomabtName": "ICE-NTS-0822",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d29432f7358e11a0264680"
     },
     {
       "codecomabtName": "ICE-NTS-0823",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d29436f7358e11a0264681"
     },
     {
       "codecomabtName": "ICE-NTS-0824",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d2943af7358e11a0264682"
     },
     {
       "codecomabtName": "ICE-NTS-0825",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d2943df7358e11a0264683"
     },
     {
       "codecomabtName": "ICE-NTS-0826",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d29440f7358e11a0264684"
     },
     {
       "codecomabtName": "ICE-NTS-0827",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d29443f7358e11a0264685"
     },
     {
       "codecomabtName": "ICE-NTS-0828",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d29447f7358e11a0264686"
     },
     {
       "codecomabtName": "ICE-NTS-0829",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d2944af7358e11a0264687"
     },
     {
       "codecomabtName": "ICE-NTS-0830",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d2944df7358e11a0264688"
     },
     {
       "codecomabtName": "ICE-NTS-0831",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d29450f7358e11a0264689"
     },
     {
       "codecomabtName": "ICE-NTS-0832",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d29453f7358e11a026468a"
     },
     {
       "codecomabtName": "ICE-NTS-0833",
       "schoolName": "LAM TAI FAI COLLEGE",
       "creatorID": "61d29456f7358e11a026468b"
     },
     {
       "codecomabtName": "ICE-NTS-0834",
       "schoolName": "SKH LAM KAU MOW SECONDARY SCHOOL",
       "creatorID": "61d2945bf7358e11a026468c"
     },
     {
       "codecomabtName": "ICE-NTS-0835",
       "schoolName": "SKH LAM KAU MOW SECONDARY SCHOOL",
       "creatorID": "61d29460f7358e11a026468d"
     },
     {
       "codecomabtName": "ICE-NTS-0836",
       "schoolName": "SKH LAM KAU MOW SECONDARY SCHOOL",
       "creatorID": "61d29464f7358e11a026468e"
     },
     {
       "codecomabtName": "ICE-NTS-0837",
       "schoolName": "SKH LAM KAU MOW SECONDARY SCHOOL",
       "creatorID": "61d29467f7358e11a026468f"
     },
     {
       "codecomabtName": "ICE-NTS-0838",
       "schoolName": "SKH LAM KAU MOW SECONDARY SCHOOL",
       "creatorID": "61d2946af7358e11a0264690"
     },
     {
       "codecomabtName": "ICE-NTS-0839",
       "schoolName": "SKH LAM KAU MOW SECONDARY SCHOOL",
       "creatorID": "61d2946ef7358e11a0264691"
     },
     {
       "codecomabtName": "ICE-NTS-0840",
       "schoolName": "SKH LAM KAU MOW SECONDARY SCHOOL",
       "creatorID": "61d29471f7358e11a0264692"
     },
     {
       "codecomabtName": "ICE-NTS-0841",
       "schoolName": "SKH LAM KAU MOW SECONDARY SCHOOL",
       "creatorID": "61d29474f7358e11a0264693"
     },
     {
       "codecomabtName": "ICE-NTS-0842",
       "schoolName": "CCC FUNG LEUNG KIT MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d29477f7358e11a0264694"
     },
     {
       "codecomabtName": "ICE-NTS-0843",
       "schoolName": "CCC FUNG LEUNG KIT MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d2947af7358e11a0264695"
     },
     {
       "codecomabtName": "ICE-NTS-0844",
       "schoolName": "CCC FUNG LEUNG KIT MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d2947ff7358e11a0264696"
     },
     {
       "codecomabtName": "ICE-NTS-0845",
       "schoolName": "CCC FUNG LEUNG KIT MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d29482f7358e11a0264697"
     },
     {
       "codecomabtName": "ICE-NTS-0846",
       "schoolName": "CCC FUNG LEUNG KIT MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d29484f7358e11a0264698"
     },
     {
       "codecomabtName": "ICE-NTS-0847",
       "schoolName": "CCC FUNG LEUNG KIT MEMORIAL SECONDARY SCHOOL",
       "creatorID": "61d29489f7358e11a0264699"
     },
     {
       "codecomabtName": "ICE-NTS-0848",
       "schoolName": "CHINESE YMCA COLLEGE",
       "creatorID": "61d2948cf7358e11a026469a"
     },
     {
       "codecomabtName": "ICE-NTS-0849",
       "schoolName": "TIN KA PING SECONDARY SCHOOL",
       "creatorID": "61d2948ef7358e11a026469b"
     },
     {
       "codecomabtName": "ICE-NTS-0850",
       "schoolName": "TIN KA PING SECONDARY SCHOOL",
       "creatorID": "61d29493f7358e11a026469c"
     },
     {
       "codecomabtName": "ICE-NTS-0851",
       "schoolName": "TIN KA PING SECONDARY SCHOOL",
       "creatorID": "61d29497f7358e11a026469d"
     },
     {
       "codecomabtName": "ICE-NTS-0852",
       "schoolName": "TIN KA PING SECONDARY SCHOOL",
       "creatorID": "61d2949af7358e11a026469e"
     },
     {
       "codecomabtName": "ICE-NTS-0853",
       "schoolName": "TIN KA PING SECONDARY SCHOOL",
       "creatorID": "61d2949df7358e11a026469f"
     },
     {
       "codecomabtName": "ICE-NTS-0854",
       "schoolName": "TIN KA PING SECONDARY SCHOOL",
       "creatorID": "61d2949ff7358e11a02646a0"
     },
     {
       "codecomabtName": "ICE-NTS-0855",
       "schoolName": "Queen Elizabeth School Old Students' Association Secondary School",
       "creatorID": "61d294a3f7358e11a02646a1"
     },
     {
       "codecomabtName": "ICE-NTS-0856",
       "schoolName": "Queen Elizabeth School Old Students' Association Secondary School",
       "creatorID": "61d294a6f7358e11a02646a2"
     },
     {
       "codecomabtName": "ICE-NTS-0857",
       "schoolName": "Queen Elizabeth School Old Students' Association Secondary School",
       "creatorID": "61d294aaf7358e11a02646a3"
     },
     {
       "codecomabtName": "ICE-NTS-0858",
       "schoolName": "CARITAS YL CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294acf7358e11a02646a4"
     },
     {
       "codecomabtName": "ICE-NTS-0859",
       "schoolName": "CARITAS YL CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294b0f7358e11a02646a5"
     },
     {
       "codecomabtName": "ICE-NTS-0860",
       "schoolName": "CARITAS YL CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294b2f7358e11a02646a6"
     },
     {
       "codecomabtName": "ICE-NTS-0861",
       "schoolName": "CARITAS YL CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294b9f7358e11a02646a7"
     },
     {
       "codecomabtName": "ICE-NTS-0862",
       "schoolName": "CARITAS YL CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294bcf7358e11a02646a8"
     },
     {
       "codecomabtName": "ICE-NTS-0863",
       "schoolName": "CARITAS YL CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294c0f7358e11a02646a9"
     },
     {
       "codecomabtName": "ICE-NTS-0864",
       "schoolName": "CARITAS YL CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294c3f7358e11a02646aa"
     },
     {
       "codecomabtName": "ICE-NTS-0865",
       "schoolName": "CARITAS YL CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294c6f7358e11a02646ab"
     },
     {
       "codecomabtName": "ICE-NTS-0866",
       "schoolName": "CARITAS YL CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294c9f7358e11a02646ac"
     },
     {
       "codecomabtName": "ICE-NTS-0867",
       "schoolName": "CARITAS YL CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294ccf7358e11a02646ad"
     },
     {
       "codecomabtName": "ICE-NTS-0868",
       "schoolName": "CARITAS YL CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294d0f7358e11a02646ae"
     },
     {
       "codecomabtName": "ICE-NTS-0869",
       "schoolName": "CARITAS YL CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294d5f7358e11a02646af"
     },
     {
       "codecomabtName": "ICE-NTS-0870",
       "schoolName": "CARITAS FANLING CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294d8f7358e11a02646b0"
     },
     {
       "codecomabtName": "ICE-NTS-0871",
       "schoolName": "CARITAS FANLING CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294dbf7358e11a02646b1"
     },
     {
       "codecomabtName": "ICE-NTS-0872",
       "schoolName": "CARITAS FANLING CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294def7358e11a02646b2"
     },
     {
       "codecomabtName": "ICE-NTS-0873",
       "schoolName": "CARITAS FANLING CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294e2f7358e11a02646b3"
     },
     {
       "codecomabtName": "ICE-NTS-0874",
       "schoolName": "CARITAS FANLING CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294e6f7358e11a02646b4"
     },
     {
       "codecomabtName": "ICE-NTS-0875",
       "schoolName": "CARITAS FANLING CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294e9f7358e11a02646b5"
     },
     {
       "codecomabtName": "ICE-NTS-0876",
       "schoolName": "CARITAS FANLING CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294ecf7358e11a02646b6"
     },
     {
       "codecomabtName": "ICE-NTS-0877",
       "schoolName": "CARITAS FANLING CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294f0f7358e11a02646b7"
     },
     {
       "codecomabtName": "ICE-NTS-0878",
       "schoolName": "CARITAS FANLING CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d294f2f7358e11a02646b8"
     },
     {
       "codecomabtName": "ICE-NTS-0879",
       "schoolName": "SALESIANS OF DON BOSCO NG SIU MUI SECONDARY SCHOOL",
       "creatorID": "61d294f8f7358e11a02646b9"
     },
     {
       "codecomabtName": "ICE-NTS-0880",
       "schoolName": "SALESIANS OF DON BOSCO NG SIU MUI SECONDARY SCHOOL",
       "creatorID": "61d294fff7358e11a02646ba"
     },
     {
       "codecomabtName": "ICE-NTS-0881",
       "schoolName": "SALESIANS OF DON BOSCO NG SIU MUI SECONDARY SCHOOL",
       "creatorID": "61d29502f7358e11a02646bb"
     },
     {
       "codecomabtName": "ICE-NTS-0882",
       "schoolName": "SALESIANS OF DON BOSCO NG SIU MUI SECONDARY SCHOOL",
       "creatorID": "61d29506f7358e11a02646bc"
     },
     {
       "codecomabtName": "ICE-NTS-0883",
       "schoolName": "SALESIANS OF DON BOSCO NG SIU MUI SECONDARY SCHOOL",
       "creatorID": "61d2950bf7358e11a02646bd"
     },
     {
       "codecomabtName": "ICE-NTS-0884",
       "schoolName": "FUNG KAI NO.1 SECONDARY SCHOOL",
       "creatorID": "61d2950df7358e11a02646be"
     },
     {
       "codecomabtName": "ICE-NTS-0885",
       "schoolName": "FUNG KAI NO.1 SECONDARY SCHOOL",
       "creatorID": "61d29512f7358e11a02646bf"
     },
     {
       "codecomabtName": "ICE-NTS-0886",
       "schoolName": "FUNG KAI NO.1 SECONDARY SCHOOL",
       "creatorID": "61d29515f7358e11a02646c0"
     },
     {
       "codecomabtName": "ICE-NTS-0887",
       "schoolName": "FUNG KAI NO.1 SECONDARY SCHOOL",
       "creatorID": "61d29518f7358e11a02646c1"
     },
     {
       "codecomabtName": "ICE-NTS-0888",
       "schoolName": "FUNG KAI NO.1 SECONDARY SCHOOL",
       "creatorID": "61d2951cf7358e11a02646c2"
     },
     {
       "codecomabtName": "ICE-NTS-0889",
       "schoolName": "AD&FD POHL LEUNG SING TAK COLLEGE",
       "creatorID": "61d29523f7358e11a02646c3"
     },
     {
       "codecomabtName": "ICE-NTS-0890",
       "schoolName": "AD&FD POHL LEUNG SING TAK COLLEGE",
       "creatorID": "61d29526f7358e11a02646c4"
     },
     {
       "codecomabtName": "ICE-NTS-0891",
       "schoolName": "AD&FD POHL LEUNG SING TAK COLLEGE",
       "creatorID": "61d29529f7358e11a02646c5"
     },
     {
       "codecomabtName": "ICE-NTS-0892",
       "schoolName": "Cotton Spinners Association Secondary School",
       "creatorID": "61d2952cf7358e11a02646c6"
     },
     {
       "codecomabtName": "ICE-NTS-0893",
       "schoolName": "Cotton Spinners Association Secondary School",
       "creatorID": "61d29530f7358e11a02646c7"
     },
     {
       "codecomabtName": "ICE-NTS-0894",
       "schoolName": "Cotton Spinners Association Secondary School",
       "creatorID": "61d29537f7358e11a02646c8"
     },
     {
       "codecomabtName": "ICE-NTS-0895",
       "schoolName": "Cotton Spinners Association Secondary School",
       "creatorID": "61d2953cf7358e11a02646c9"
     },
     {
       "codecomabtName": "ICE-NTS-0896",
       "schoolName": "Cotton Spinners Association Secondary School",
       "creatorID": "61d2953ff7358e11a02646ca"
     },
     {
       "codecomabtName": "ICE-NTS-0897",
       "schoolName": "Cotton Spinners Association Secondary School",
       "creatorID": "61d29543f7358e11a02646cb"
     },
     {
       "codecomabtName": "ICE-NTS-0898",
       "schoolName": "Cotton Spinners Association Secondary School",
       "creatorID": "61d29547f7358e11a02646cc"
     },
     {
       "codecomabtName": "ICE-NTS-0899",
       "schoolName": "Cotton Spinners Association Secondary School",
       "creatorID": "61d2954bf7358e11a02646cd"
     },
     {
       "codecomabtName": "ICE-NTS-0900",
       "schoolName": "Cotton Spinners Association Secondary School",
       "creatorID": "61d29551f7358e11a02646ce"
     },
     {
       "codecomabtName": "ICE-NTS-0901",
       "schoolName": "Cotton Spinners Association Secondary School",
       "creatorID": "61d29557f7358e11a02646cf"
     },
     {
       "codecomabtName": "ICE-NTS-0902",
       "schoolName": "Cotton Spinners Association Secondary School",
       "creatorID": "61d2955bf7358e11a02646d0"
     },
     {
       "codecomabtName": "ICE-NTS-0903",
       "schoolName": "Cotton Spinners Association Secondary School",
       "creatorID": "61d2955ef7358e11a02646d1"
     },
     {
       "codecomabtName": "ICE-NTS-0904",
       "schoolName": "RENAISSANCE COLLEGE (SECONDARY)\n",
       "creatorID": "61d29562f7358e11a02646d2"
     },
     {
       "codecomabtName": "ICE-NTS-0905",
       "schoolName": "SHA TIN GOVERNMENT SECONDARY SCHOOL",
       "creatorID": "61d29567f7358e11a02646d3"
     },
     {
       "codecomabtName": "ICE-NTS-0906",
       "schoolName": "CUHKFAA CHAN CHUN HA SECONDARY SCHOOL",
       "creatorID": "61d2956af7358e11a02646d4"
     },
     {
       "codecomabtName": "ICE-NTS-0907",
       "schoolName": "HONG KONG ADVENTIST ACADEMY (SECONDARY)\n",
       "creatorID": "61d2956ef7358e11a02646d5"
     },
     {
       "codecomabtName": "ICE-NTS-0908",
       "schoolName": "TAI KWONG HILARY COLLEGE",
       "creatorID": "61d29570f7358e11a02646d6"
     },
     {
       "codecomabtName": "ICE-NTS-0909",
       "schoolName": "PLK HO YUK CHING (1984) COLLEGE",
       "creatorID": "61d29574f7358e11a02646d7"
     },
     {
       "codecomabtName": "ICE-NTS-0910",
       "schoolName": "STEWARDS POOI KEI COLLEGE",
       "creatorID": "61d29577f7358e11a02646d8"
     },
     {
       "codecomabtName": "ICE-NTS-0911",
       "schoolName": "CREATIVE SECONDARY SCHOOL",
       "creatorID": "61d2957bf7358e11a02646d9"
     },
     {
       "codecomabtName": "ICE-NTS-0912",
       "schoolName": "KWOK TAK SENG CATHOLIC SECONDARY",
       "creatorID": "61d29580f7358e11a02646da"
     },
     {
       "codecomabtName": "ICE-NTS-0913",
       "schoolName": "POPE PAUL VI COLLEGE",
       "creatorID": "61d29585f7358e11a02646db"
     },
     {
       "codecomabtName": "ICE-NTS-0914",
       "schoolName": "HKFYG LEE SHAU KEE COLLEGE",
       "creatorID": "61d29588f7358e11a02646dc"
     },
     {
       "codecomabtName": "ICE-NTS-0915",
       "schoolName": "HKFYG LEE SHAU KEE COLLEGE",
       "creatorID": "61d2958cf7358e11a02646dd"
     },
     {
       "codecomabtName": "ICE-NTS-0916",
       "schoolName": "NTHYK YUEN LONG DISTRICT SECONDARY SCHOOL",
       "creatorID": "61d2958ef7358e11a02646de"
     },
     {
       "codecomabtName": "ICE-NTS-0917",
       "schoolName": "DISCOVERY COLLEGE (SECONDARY)",
       "creatorID": "61d29591f7358e11a02646df"
     },
     {
       "codecomabtName": "ICE-NTS-0918",
       "schoolName": "PENTECOSTAL LAM HON KWONG SCHOOL",
       "creatorID": "61d29595f7358e11a02646e0"
     },
     {
       "codecomabtName": "ICE-NTS-0919",
       "schoolName": "TIACC Woo Hon Fai Secondary School",
       "creatorID": "61d29598f7358e11a02646e1"
     },
     {
       "codecomabtName": "ICE-NTS-0920",
       "schoolName": "TIACC Woo Hon Fai Secondary School",
       "creatorID": "61d2959cf7358e11a02646e2"
     },
     {
       "codecomabtName": "ICE-NTS-0921",
       "schoolName": "TIACC Woo Hon Fai Secondary School",
       "creatorID": "61d2959ef7358e11a02646e3"
     },
     {
       "codecomabtName": "ICE-NTS-0922",
       "schoolName": "TIACC Woo Hon Fai Secondary School",
       "creatorID": "61d295a2f7358e11a02646e4"
     },
     {
       "codecomabtName": "ICE-NTS-0923",
       "schoolName": "TIACC Woo Hon Fai Secondary School",
       "creatorID": "61d295a5f7358e11a02646e5"
     },
     {
       "codecomabtName": "ICE-NTS-0924",
       "schoolName": "TIACC Woo Hon Fai Secondary School",
       "creatorID": "61d295a9f7358e11a02646e6"
     },
     {
       "codecomabtName": "ICE-NTS-0925",
       "schoolName": "TIACC Woo Hon Fai Secondary School",
       "creatorID": "61d295acf7358e11a02646e7"
     },
     {
       "codecomabtName": "ICE-NTS-0926",
       "schoolName": "TIACC Woo Hon Fai Secondary School",
       "creatorID": "61d295b0f7358e11a02646e8"
     },
     {
      "codecomabtName": "ICE-NTS-0977",
      "schoolName": "CARMEL ALISON LAM FOUNDATION SECONDARY SCHOOL",
      "creatorID": "61d29672f7358e11a026471b"
    },
    {
      "codecomabtName": "ICE-NTS-0978",
      "schoolName": "CARMEL ALISON LAM FOUNDATION SECONDARY SCHOOL",
      "creatorID": "61d29675f7358e11a026471c"
    },
    {
      "codecomabtName": "ICE-NTS-0979",
      "schoolName": "CARMEL ALISON LAM FOUNDATION SECONDARY SCHOOL",
      "creatorID": "61d29678f7358e11a026471d"
    },
    {
      "codecomabtName": "ICE-NTS-0980",
      "schoolName": "CARMEL ALISON LAM FOUNDATION SECONDARY SCHOOL",
      "creatorID": "61d2967cf7358e11a026471e"
    },
    {
      "codecomabtName": "ICE-NTS-0981",
      "schoolName": "CARMEL ALISON LAM FOUNDATION SECONDARY SCHOOL",
      "creatorID": "61d2967ff7358e11a026471f"
    },
    {
      "codecomabtName": "ICE-NTS-0982",
      "schoolName": "CARMEL ALISON LAM FOUNDATION SECONDARY SCHOOL",
      "creatorID": "61d29681f7358e11a0264720"
    },
    {
      "codecomabtName": "ICE-NTS-0983",
      "schoolName": "CARMEL ALISON LAM FOUNDATION SECONDARY SCHOOL",
      "creatorID": "61d29685f7358e11a0264721"
    },
    {
      "codecomabtName": "ICE-NTS-0984",
      "schoolName": "CARMEL ALISON LAM FOUNDATION SECONDARY SCHOOL",
      "creatorID": "61d29689f7358e11a0264722"
    },
    {
      "codecomabtName": "ICE-NTS-0985",
      "schoolName": "CARMEL ALISON LAM FOUNDATION SECONDARY SCHOOL",
      "creatorID": "61d2968ef7358e11a0264723"
    }

    

    ];


  ndata.map((d) => {
    let student = NTschoolData.filter(
      (x) => x.creatorID === d.creator
    )[0];

    if (student) {
      
        nRankings.push({
          name: d.creatorName,
          schoolName: student.schoolName,
          score: Math.round(d.leagues[0].stats.totalScore * 100),
          
        });
        oRankings.push({
          name: d.creatorName,
          schoolName: student.schoolName,
          score: Math.round(d.leagues[0].stats.totalScore * 100),
          
        });
      }
  });
  const mres = await fetch(
    `https://codecombat.com/db/level/5fca06dc8b4da8002889dbf1/rankings?order=-1&scoreOffset=1000000&team=humans&leagues.leagueID=61d3966df4636d064c6f5de2&limit=100`
  );
  const mdata = await mres.json();
  

  const MOschoolData = [
    
    {
      "codecomabtName": "ICE-MOP-1027",
      "schoolName": "Macao Pooi To Middle School Taipa Primary School",
      "creatorID": "61d28f5df7358e11a026450c"
    },
    {
      "codecomabtName": "ICE-MOP-1028",
      "schoolName": "Macao Pooi To Middle School Taipa Primary School",
      "creatorID": "61d28f61f7358e11a026450d"
    },
    {
      "codecomabtName": "ICE-MOP-1029",
      "schoolName": "Macao Pooi To Middle School Taipa Primary School",
      "creatorID": "61d28f64f7358e11a026450e"
    },
    {
      "codecomabtName": "ICE-MOP-1030",
      "schoolName": "Macao Pooi To Middle School Taipa Primary School",
      "creatorID": "61d28f67f7358e11a026450f"
    },
    {
      "codecomabtName": "ICE-MOP-1031",
      "schoolName": "Macao Pooi To Middle School Taipa Primary School",
      "creatorID": "61d28f6af7358e11a0264510"
    },
    {
      "codecomabtName": "ICE-MOP-1032",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d28f6df7358e11a0264511"
    },
    {
      "codecomabtName": "ICE-MOP-1033",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d28f71f7358e11a0264512"
    },
    {
      "codecomabtName": "ICE-MOP-1034",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d28f74f7358e11a0264513"
    },
    {
      "codecomabtName": "ICE-MOP-1035",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d28f76f7358e11a0264514"
    },
    {
      "codecomabtName": "ICE-MOP-1036",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d28f79f7358e11a0264515"
    },
    {
      "codecomabtName": "ICE-MOP-1037",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d28f7bf7358e11a0264516"
    },
    {
      "codecomabtName": "ICE-MOP-1038",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d28f7ff7358e11a0264517"
    },
    {
      "codecomabtName": "ICE-MOP-1039",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d28f84f7358e11a0264518"
    },
    {
      "codecomabtName": "ICE-MOP-1040",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d28f87f7358e11a0264519"
    },
    {
      "codecomabtName": "ICE-MOP-1041",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d28f89f7358e11a026451a"
    },
    {
      "codecomabtName": "ICE-MOP-1042",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d28f8bf7358e11a026451b"
    },
    {
      "codecomabtName": "ICE-MOP-1043",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d28f92f7358e11a026451c"
    },
    {
      "codecomabtName": "ICE-MOP-1044",
      "schoolName": "Puiva Middle school of Macao",
      "creatorID": "61d28f94f7358e11a026451d"
    },
    {
      "codecomabtName": "ICE-MOP-1045",
      "schoolName": "Puiva Middle school of Macao",
      "creatorID": "61d28f98f7358e11a026451e"
    },
    {
      "codecomabtName": "ICE-MOP-1046",
      "schoolName": "Puiva Middle school of Macao",
      "creatorID": "61d28f9df7358e11a026451f"
    },
    {
      "codecomabtName": "ICE-MOP-1047",
      "schoolName": "Puiva Middle school of Macao",
      "creatorID": "61d28fa0f7358e11a0264520"
    },
    {
      "codecomabtName": "ICE-MOP-1048",
      "schoolName": "Puiva Middle school of Macao",
      "creatorID": "61d28fa3f7358e11a0264521"
    },
    {
      "codecomabtName": "ICE-MOP-1049",
      "schoolName": "Puiva Middle school of Macao",
      "creatorID": "61d28fa7f7358e11a0264522"
    },
    {
      "codecomabtName": "ICE-MOP-1050",
      "schoolName": "Puiva Middle school of Macao",
      "creatorID": "61d28facf7358e11a0264523"
    },
    {
      "codecomabtName": "ICE-MOP-1051",
      "schoolName": "Puiva Middle school of Macao",
      "creatorID": "61d28faef7358e11a0264524"
    },
    {
      "codecomabtName": "ICE-MOP-1052",
      "schoolName": "Puiva Middle school of Macao",
      "creatorID": "61d28fb1f7358e11a0264525"
    },
    {
      "codecomabtName": "ICE-MOP-1053",
      "schoolName": "Puiva Middle school of Macao",
      "creatorID": "61d28fb5f7358e11a0264526"
    },
    {
      "codecomabtName": "ICE-MOP-1054",
      "schoolName": "Puiva Middle school of Macao",
      "creatorID": "61d28fb8f7358e11a0264527"
    },
    {
      "codecomabtName": "ICE-MOP-1055",
      "schoolName": "Puiva Middle school of Macao",
      "creatorID": "61d28fbcf7358e11a0264528"
    },
    {
      "codecomabtName": "ICE-MOS-1056",
      "schoolName": "Macau Baptist College",
      "creatorID": "61d28fbff7358e11a0264529"
    },
    {
      "codecomabtName": "ICE-MOS-1057",
      "schoolName": "Macau Baptist College",
      "creatorID": "61d28fc5f7358e11a026452a"
    },
    {
      "codecomabtName": "ICE-MOS-1058",
      "schoolName": "Macau Baptist College",
      "creatorID": "61d28fc8f7358e11a026452b"
    },
    {
      "codecomabtName": "ICE-MOS-1059",
      "schoolName": "Macau Baptist College",
      "creatorID": "61d28fcbf7358e11a026452c"
    },
    {
      "codecomabtName": "ICE-MOS-1060",
      "schoolName": "Macau Baptist College",
      "creatorID": "61d28fcef7358e11a026452d"
    },
    {
      "codecomabtName": "ICE-MOS-1061",
      "schoolName": "Macau Baptist College",
      "creatorID": "61d28fd1f7358e11a026452e"
    },
    {
      "codecomabtName": "ICE-MOS-1062",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d28fd6f7358e11a026452f"
    },
    {
      "codecomabtName": "ICE-MOS-1063",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d28fd9f7358e11a0264530"
    },
    {
      "codecomabtName": "ICE-MOS-1064",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d28fdcf7358e11a0264531"
    },
    {
      "codecomabtName": "ICE-MOS-1065",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d28fdef7358e11a0264532"
    },
    {
      "codecomabtName": "ICE-MOS-1066",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d28fe1f7358e11a0264533"
    },
    {
      "codecomabtName": "ICE-MOS-1067",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d28fe6f7358e11a0264534"
    },
    {
      "codecomabtName": "ICE-MOS-1068",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d28fe9f7358e11a0264535"
    },
    {
      "codecomabtName": "ICE-MOS-1069",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d28fecf7358e11a0264536"
    },
    {
      "codecomabtName": "ICE-MOS-1070",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d28feff7358e11a0264537"
    },
    {
      "codecomabtName": "ICE-MOS-1071",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d28ff2f7358e11a0264538"
    },
    {
      "codecomabtName": "ICE-MOS-1072",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d28ff4f7358e11a0264539"
    },
    {
      "codecomabtName": "ICE-MOS-1073",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d28ff8f7358e11a026453a"
    },
    {
      "codecomabtName": "ICE-MOS-1074",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d28ffbf7358e11a026453b"
    },
    {
      "codecomabtName": "ICE-MOS-1075",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d28ffdf7358e11a026453c"
    },
    {
      "codecomabtName": "ICE-MOS-1076",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d29000f7358e11a026453d"
    },
    {
      "codecomabtName": "ICE-MOS-1077",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d29007f7358e11a026453e"
    },
    {
      "codecomabtName": "ICE-MOS-1078",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d29009f7358e11a026453f"
    },
    {
      "codecomabtName": "ICE-MOS-1079",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d2900df7358e11a0264540"
    },
    {
      "codecomabtName": "ICE-MOS-1080",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d2900ff7358e11a0264541"
    },
    {
      "codecomabtName": "ICE-MOS-1081",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d29013f7358e11a0264542"
    },
    {
      "codecomabtName": "ICE-MOS-1082",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d29016f7358e11a0264543"
    },
    {
      "codecomabtName": "ICE-MOS-1083",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d29018f7358e11a0264544"
    },
    {
      "codecomabtName": "ICE-MOS-1084",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d2901bf7358e11a0264545"
    },
    {
      "codecomabtName": "ICE-MOS-1085",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d2901ef7358e11a0264546"
    },
    {
      "codecomabtName": "ICE-MOS-1086",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d29020f7358e11a0264547"
    },
    {
      "codecomabtName": "ICE-MOS-1087",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d29023f7358e11a0264548"
    },
    {
      "codecomabtName": "ICE-MOS-1088",
      "schoolName": "Colégio Diocesano de São José 5",
      "creatorID": "61d29025f7358e11a0264549"
    },
    {
      "codecomabtName": "ICE-MOS-1089",
      "schoolName": "The Affiliated School of the University of Macau (secondary)",
      "creatorID": "61d29028f7358e11a026454a"
    },
    {
      "codecomabtName": "ICE-MOS-1090",
      "schoolName": "The Affiliated School of the University of Macau (secondary)",
      "creatorID": "61d2902cf7358e11a026454b"
    },
    {
      "codecomabtName": "ICE-MOS-1091",
      "schoolName": "The Affiliated School of the University of Macau (secondary)",
      "creatorID": "61d2902ef7358e11a026454c"
    },
    {
      "codecomabtName": "ICE-MOS-1092",
      "schoolName": "The Affiliated School of the University of Macau (secondary)",
      "creatorID": "61d29031f7358e11a026454d"
    },
    {
      "codecomabtName": "ICE-MOS-1093",
      "schoolName": "The Affiliated School of the University of Macau (secondary)",
      "creatorID": "61d29033f7358e11a026454e"
    },
    {
      "codecomabtName": "ICE-MOS-1094",
      "schoolName": "The Affiliated School of the University of Macau (secondary)",
      "creatorID": "61d29036f7358e11a026454f"
    },
    {
      "codecomabtName": "ICE-MOS-1095",
      "schoolName": "The Affiliated School of the University of Macau (secondary)",
      "creatorID": "61d29039f7358e11a0264550"
    },
    {
      "codecomabtName": "ICE-MOS-1096",
      "schoolName": "The Affiliated School of the University of Macau (secondary)",
      "creatorID": "61d2903cf7358e11a0264551"
    },
    {
      "codecomabtName": "ICE-MOS-1097",
      "schoolName": "The Affiliated School of the University of Macau (secondary)",
      "creatorID": "61d29041f7358e11a0264552"
    },
    {
      "codecomabtName": "ICE-MOS-1152",
      "schoolName": "The Affiliated School of the University of Macau (secondary)",
      "creatorID": "61d290faf7358e11a0264589"
    },
    {
      "codecomabtName": "ICE-MOS-1153",
      "schoolName": "The Affiliated School of the University of Macau (secondary)",
      "creatorID": "61d290fff7358e11a026458a"
    },
    {
      "codecomabtName": "ICE-MOS-1154",
      "schoolName": "The Affiliated School of the University of Macau (secondary)",
      "creatorID": "61d29102f7358e11a026458b"
    },
    {
      "codecomabtName": "ICE-MOS-1155",
      "schoolName": "The Affiliated School of the University of Macau (secondary)",
      "creatorID": "61d29105f7358e11a026458c"
    },
    {
      "codecomabtName": "ICE-MOS-1098",
      "schoolName": "Colegio de Santa Rosa de Lima Chinese Section",
      "creatorID": "61d29044f7358e11a0264553"
    },
    {
      "codecomabtName": "ICE-MOS-1099",
      "schoolName": "Colegio de Santa Rosa de Lima Chinese Section",
      "creatorID": "61d2904cf7358e11a0264554"
    },
    {
      "codecomabtName": "ICE-MOS-1100",
      "schoolName": "Colegio de Santa Rosa de Lima Chinese Section",
      "creatorID": "61d2904ff7358e11a0264555"
    },
    {
      "codecomabtName": "ICE-MOS-1101",
      "schoolName": "Colegio de Santa Rosa de Lima Chinese Section",
      "creatorID": "61d29052f7358e11a0264556"
    },
    {
      "codecomabtName": "ICE-MOP-1102",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d29054f7358e11a0264557"
    },
    {
      "codecomabtName": "ICE-MOP-1103",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d29057f7358e11a0264558"
    },
    {
      "codecomabtName": "ICE-MOP-1104",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d2905af7358e11a0264559"
    },
    {
      "codecomabtName": "ICE-MOP-1105",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d2905ef7358e11a026455a"
    },
    {
      "codecomabtName": "ICE-MOP-1106",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d29062f7358e11a026455b"
    },
    {
      "codecomabtName": "ICE-MOP-1107",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d29065f7358e11a026455c"
    },
    {
      "codecomabtName": "ICE-MOP-1108",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d2906af7358e11a026455d"
    },
    {
      "codecomabtName": "ICE-MOP-1109",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d2906df7358e11a026455e"
    },
    {
      "codecomabtName": "ICE-MOP-1110",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d29071f7358e11a026455f"
    },
    {
      "codecomabtName": "ICE-MOP-1111",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d29074f7358e11a0264560"
    },
    {
      "codecomabtName": "ICE-MOP-1112",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d29077f7358e11a0264561"
    },
    {
      "codecomabtName": "ICE-MOP-1113",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d2907af7358e11a0264562"
    },
    {
      "codecomabtName": "ICE-MOP-1114",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d2907cf7358e11a0264563"
    },
    {
      "codecomabtName": "ICE-MOP-1115",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d2907ff7358e11a0264564"
    },
    {
      "codecomabtName": "ICE-MOP-1116",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d29081f7358e11a0264565"
    },
    {
      "codecomabtName": "ICE-MOP-1117",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d29083f7358e11a0264566"
    },
    {
      "codecomabtName": "ICE-MOP-1118",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d29087f7358e11a0264567"
    },
    {
      "codecomabtName": "ICE-MOP-1119",
      "schoolName": "The Affiliated School of the University of Macau",
      "creatorID": "61d2908af7358e11a0264568"
    }
   ];


  mdata.map((d) => {
    let student = MOschoolData.filter(
      (x) => x.creatorID === d.creator
    )[0];

    if (student) {
      
        mRankings.push({
          name: d.creatorName,
          schoolName: student.schoolName,
          score: Math.round(d.leagues[0].stats.totalScore * 100),
          
        });
        oRankings.push({
          name: d.creatorName,
          schoolName: student.schoolName,
          score: Math.round(d.leagues[0].stats.totalScore * 100),
          
        });
      }
  });



  return { props: { hRankings, kRankings, nRankings, oRankings,mRankings } };
}


/**
 * @description
 * Returns a function which will sort an
 * array of objects by the given key.
 *
 * @param  {String}  key
 * @param  {Boolean} reverse
 * @return {Function}
 */
 const sortBy = (key, reverse) => {

  // Move smaller items towards the front
  // or back of the array depending on if
  // we want to sort the array in reverse
  // order or not.
  const moveSmaller = reverse ? 1 : -1;

  // Move larger items towards the front
  // or back of the array depending on if
  // we want to sort the array in reverse
  // order or not.
  const moveLarger = reverse ? -1 : 1;

  /**
   * @param  {*} a
   * @param  {*} b
   * @return {Number}
   */
  return (a, b) => {
    if (a[key] > b[key]) {
      return moveSmaller;
    }
    if (a[key] < b[key]) {
      return moveLarger;
    }
    return 0;
  };
};