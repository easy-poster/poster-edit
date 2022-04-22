export default {
  randomColor: () => {
    let color = '#';
    for (var i = 0; i < 6; i++)
      color += parseInt(Math.random() * 16).toString(16);
    return color;
  },
};
