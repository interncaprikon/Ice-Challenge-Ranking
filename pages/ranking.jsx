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

const useStyles = makeStyles({
  table: {
    maxWidth:'95%',
    minWidth:350,
    position:'relative',
  },
  bgroup:{
    maxWidth:'95%',
    minWidth:350,
    position:'fixed',
  }
});

const theme = createTheme({
  palette: {
    secondary: {
      main: "#c2240b",
      light: "#ae240e"
    }
  }
});


function createData(rank, name, schoolName, score) {
  return { rank, name, schoolName, score };
}


export default function RankingList({
  hRankings,
  kRankings,
  nRankings,
  oRankings,
}) {
  const classes = useStyles();
  const [rows, setRowData] = useState([]);
  const [divisionTitle, setDivisionTitle] = useState("Overall");

  useEffect(() => {
    loadsRankings(oRankings);
  }, []);

  function loadsRankings(rankings) {
    let data = [];
    rankings.sort(sortBy("score"));
	  var oldscore=0;
    var oldrank=0;
    rankings.map((rank, index) => {
      if (oldscore==rank.score){
      data.push(
        createData(oldrank, rank.name, rank.schoolName, rank.score)
      );}
      else{data.push(
        createData(index + 1, rank.name, rank.schoolName, rank.score)
      );
      oldrank=index+1;}
      oldscore=rank.score;
      
    });
    setRowData(data);
  }

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
  <ThemeProvider theme={theme}>
    <Container maxWidth="md">
    
    <Box textAlign='center'>
    <Grid container justify="center">
      <ButtonGroup  className={classes.bgroup} 
        variant="contained" color="secondary" aria-label="contained primary button group"
        display='flex' justifyContent='center'
      >
        <Button
          onClick={() => {
            loadsRankings(oRankings);
            setDivisionTitle("Overall");
          }}
        >
          Overall
        </Button>
        <Button 
          onClick={() => {
            loadsRankings(hRankings);
            setDivisionTitle("Hong Kong Island");
          }}
        >
          Hong Kong Island
        </Button>
        <Button 
          onClick={() => {
            loadsRankings(kRankings);
            setDivisionTitle("Kowloon");
          }}
        >
          Kowloon
        </Button>
        <Button 
          onClick={() => {
            loadsRankings(nRankings);
            setDivisionTitle("New Territories");
          }}
        >
          New Territories
        </Button>
        
      </ButtonGroup>
      </Grid>
      </Box>
      <Typography variant="h4" align="center" gutterBottom>
        {divisionTitle} 
      </Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
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
              <TableRow key={row.rank}>
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
    </ThemeProvider>
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
  const hres = await fetch(
    `https://codecombat.com/db/level/5fca06dc8b4da8002889dbf1/rankings?order=-1&scoreOffset=1000000&team=humans&leagues.leagueID=61d3a182f4636d064c6f5de5&limit=100`
  );
  const hdata = await hres.json();
  

  const HKschoolData = [
    
    {
      "codecomabtName": "XXXXXXX",
      "creatorID": "564ba9b7a33967be1312ae6d",
      "name": "Diamond AI",
      "schoolName": "HKI School Name 1",
    },
    {
      "codecomabtName": "XXXXXXX",
      "creatorID": "564ba95ca33967be1312ae69",
      "name": "Platinum AI",
      "schoolName": "HKI School Name 2",
    },
    {
      "codecomabtName": "XXXXXXX",
      "creatorID": "564ba91aa33967be1312ae65",
      "name": "Gold AI",
      "schoolName": "HKI School Name 3",
    },
    {
      "codecomabtName": "XXXXXXX",
      "creatorID": "564ba830a33967be1312ae61",
      "name": "Silver AI",
      "schoolName": "HKI School Name 3",
    },
    {
      "codecomabtName": "XXXXXXX",
      "creatorID": "564ba6cea33967be1312ae59",
      "name": "Bronze AI",
      "schoolName": "HKI School Name 4",
    },
  ];


  hdata.map((d) => {
    let student = HKschoolData.filter(
      (x) => x.creatorID === d.creator
    )[0];

    if (student) {
      
        hRankings.push({
          name: student.name,
          schoolName: d.creatorName,
          score: Math.round(d.leagues[0].stats.totalScore * 100),
          
        });
        oRankings.push({
          name: student.name,
          schoolName: d.creatorName,
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
      "codecomabtName": "XXXXX",
      "creatorID": "564ba9b7a33967be1312ae6d",
      "name": "Diamond AI",
      "schoolName": "KLN School Name 1",
    },
    {
      "codecomabtName": "XXXXXXX",
      "creatorID": "564ba95ca33967be1312ae69",
      "name": "Platinum AI",
      "schoolName": "KLN School Name 2",
    },
    {
      "codecomabtName": "XXXXXXX",
      "creatorID": "564ba91aa33967be1312ae65",
      "name": "Gold AI",
      "schoolName": "KLN School Name 3",
    },
    {
      "codecomabtName": "XXXXXXX",
      "creatorID": "564ba830a33967be1312ae61",
      "name": "Silver AI",
      "schoolName": "KLN School Name 3",
    },
    {
      "codecomabtName": "XXXXXXX",
      "creatorID": "564ba6cea33967be1312ae59",
      "name": "Bronze AI",
      "schoolName": "KLN School Name 4",
    },
  ];


  kdata.map((d) => {
    let student = KLNschoolData.filter(
      (x) => x.creatorID === d.creator
    )[0];

    if (student) {
      
        kRankings.push({
          name: student.name,
          schoolName: d.creatorName,
          score: Math.round(d.leagues[0].stats.totalScore * 100),
          
        });
        oRankings.push({
          name: student.name,
          schoolName: d.creatorName,
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
      "codecomabtName": "XXXXXXX",
      "creatorID": "564ba9b7a33967be1312ae6d",
      "name": "Diamond AI",
      "schoolName": "NT School Name 1",
    },
    {
      "codecomabtName": "XXXXXXX",
      "creatorID": "564ba95ca33967be1312ae69",
      "name": "Platinum AI",
      "schoolName": "NT School Name 2",
    },
    {
      "codecomabtName": "XXXXXXX",
      "creatorID": "564ba91aa33967be1312ae65",
      "name": "Gold AI",
      "schoolName": "NT School Name 3",
    },
    {
      "codecomabtName": "XXXXXXX",
      "creatorID": "564ba830a33967be1312ae61",
      "name": "Silver AI",
      "schoolName": "NT School Name 3",
    },
    {
      "codecomabtName": "XXXXXXX",
      "creatorID": "564ba6cea33967be1312ae59",
      "name": "Bronze AI",
      "schoolName": "NT School Name 4",
    },
  ];


  ndata.map((d) => {
    let student = NTschoolData.filter(
      (x) => x.creatorID === d.creator
    )[0];

    if (student) {
      
        nRankings.push({
          name: student.name,
          schoolName: d.creatorName,
          score: Math.round(d.leagues[0].stats.totalScore * 100),
          
        });
        oRankings.push({
          name: student.name,
          schoolName: d.creatorName,
          score: Math.round(d.leagues[0].stats.totalScore * 100),
          
        });
      }
  });



  return { props: { hRankings, kRankings, nRankings, oRankings } };
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