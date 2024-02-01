document.addEventListener('DOMContentLoaded', function () {
  const equalizerContainer = document.getElementById('equalizer');
  const audioPlayer = document.getElementById('audioPlayer'); 
  const fileInput = document.querySelector('.download_music input');

  const tableContainer = document.createElement('table');
  equalizerContainer.innerHTML = '';
  equalizerContainer.appendChild(tableContainer);

  const drawTable = () => {
    for (let i = 0; i < 9; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < 9; j++) {
        const cell = document.createElement('td');
        const cellValue = i * 9 + j + 1;
        cell.dataset.cellValue = cellValue;
        row.appendChild(cell);
      }
      tableContainer.appendChild(row);
    }
  }
  
  drawTable();

  
  fileInput.addEventListener('change', function () {
    loadAudio(this);
  });

  function loadAudio(input) {
    const file = input.files[0];
    

    if (file) {
      const fileURL = URL.createObjectURL(file); 
      console.log(fileURL)
      audioPlayer.src = fileURL; 
      audioPlayer.addEventListener('playing', function () {
        console.log('play');
        visualizeAudio();
      });
      audioPlayer.addEventListener('pause', function () {
        console.log('pause');
      });
      
    }
  }

  function visualizeAudio() {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioPlayer);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
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
        requestAnimationFrame(draw);
      }, 100);
    }

    draw();
  }

});