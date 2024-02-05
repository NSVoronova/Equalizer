document.addEventListener('DOMContentLoaded', function () {
  const equalizerContainer = document.getElementById('equalizer');
  const audioPlayer = document.getElementById('audioPlayer');
  const fileInput = document.querySelector('.download_music input');

  const tableContainer = document.createElement('table');
  equalizerContainer.appendChild(tableContainer);


  for (let i = 0; i < 9; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement('td');
      row.appendChild(cell);
    }
    tableContainer.appendChild(row);
  }

  fileInput.addEventListener('change', function () {
    loadAudio(this);
  });

  function loadAudio(input) {
    const file = input.files[0];

    if (file) {
      const fileURL = URL.createObjectURL(file);
      audioPlayer.src = fileURL;
        visualizeAudio();
    }
  }

  function visualizeAudio() {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioPlayer);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 128;
    const dataArray = new Uint8Array(128);

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);

      const rows = tableContainer.rows;
      const cellCount = rows[0].cells.length;

      for (let j = 0; j < cellCount; j++) {
        const cellsToColor = dataArray[j] % rows.length;

        for (let i = rows.length - 1; i >= 0; i--) {
          const cell = rows[i].cells[j];

          if (i >= rows.length - cellsToColor) {
            cell.style.backgroundColor = 'green';
          } else {
            cell.style.backgroundColor = 'white';
          }
        }
      }

      setTimeout(() => {
      window.requestAnimationFrame(draw);
      }, 50);
    }
    draw();
  }
});