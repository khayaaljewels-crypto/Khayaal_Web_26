const reel = (id, link) => ({
  id,
  link,
  // Instagram serves the Reel's own preview image from this media endpoint.
  image: `https://www.instagram.com/reel/${id}/media/?size=l`,
});

export const instagramPosts = [
  reel('Ddq1f_svAmH', 'https://www.instagram.com/reel/Ddq1f_svAmH/?stkn=MXdhcjZiOHdwNjRqcQ=='),
  reel('DdJd0U3z3LB', 'https://www.instagram.com/reel/DdJd0U3z3LB/?stkn=MXc1MG1zdnl0MW5vMg=='),
  reel('DdgiPv9PUdw', 'https://www.instagram.com/reel/DdgiPv9PUdw/?stkn=MTUxOWNsbTczMTFmaA=='),
  reel('DdNyDMQzTfd', 'https://www.instagram.com/reel/DdNyDMQzTfd/?stkn=MThjbG9panl1bGczdw=='),
  reel('DdY3TGevox9', 'https://www.instagram.com/reel/DdY3TGevox9/?stkn=Mng4NnMyYmlnN2Ft'),
  reel('DdVicL6Pm1f', 'https://www.instagram.com/reel/DdVicL6Pm1f/?stkn=MWNzbXB4c2pxanJvOA=='),
];
