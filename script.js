// Load data from JSON files
let data1 = [];
let data2 = [];

fetch('kjvdatawithidkey1.json')
  .then(response => response.json())
  .then(json => {
    data1 = json;
    populateTable1(1);
  });

fetch('questionskjv1.json')
  .then(response => response.json())
  .then(json => {
    data2 = json;
    populateTable2(1);
  });

  function populateTable1(page) {
  let tableBody = document.querySelector('#table1 tbody');
  tableBody.innerHTML = '';
  let searchValue = document.querySelector('#search1').value.toLowerCase();
  //*** */
  let filteredData = data1.filter(row => {
  let book = row.book.toLowerCase();
  let verse = row.verse.toLowerCase();
  let allText = book + verse;
  return allText.includes(searchValue);
});


  //*** */
  if (searchValue.toLowerCase().startsWith('book ')) {
    let bookName = searchValue.substring(10).toLowerCase();
    filteredData = filteredData.filter(row => {
      let book = row.book.toLowerCase();
      return book.includes(bookName);
    });
  }
  let startIndex = (page - 1) * 10;
  let endIndex = startIndex + 10;
  let pageData = filteredData.slice(startIndex, endIndex);
  pageData.forEach(row => {
    let tr = document.createElement('tr');
    let tdBook = document.createElement('td');
    tdBook.textContent = row.book;
    let tdVerse = document.createElement('td');
    tdVerse.textContent = row.verse;
    tr.appendChild(tdBook);
    tr.appendChild(tdVerse);
    // add event listener to row
    tr.addEventListener('click', () => {
      // save the index of the row in the filtered data array as a bookmark
      let bookmarkedRowIndex = filteredData.indexOf(row);
      localStorage.setItem('table1Bookmark', JSON.stringify({index: bookmarkedRowIndex, searchValue: searchValue}));
      // display a message to confirm bookmarking
      alert(`Bookmark saved: ${row.book}`);
    });

    tableBody.appendChild(tr);
  });
  
  // add a "Bookmarks" section to the page
  let bookmarksSection = document.querySelector('#bookmarks-section');
  if (!bookmarksSection) {
    bookmarksSection = document.createElement('div');
    bookmarksSection.id = 'bookmarks-section';
    document.body.appendChild(bookmarksSection);
  } else {
    bookmarksSection.innerHTML = '';
  }

  // add a button to the "Bookmarks" section to go back to the bookmarked row
  let bookmarksButton = document.createElement('button');
  bookmarksButton.textContent = 'Go to Bookmark';
  bookmarksButton.addEventListener('click', () => {
    let bookmarkString = localStorage.getItem('table1Bookmark');
    if (bookmarkString) {
      let bookmark = JSON.parse(bookmarkString);
      let bookmarkedRowIndex = bookmark.index;
      let searchValue = bookmark.searchValue;
      let filteredData = data1.filter(row => {
        let book = row.book.toLowerCase();
        let verse = row.verse.toLowerCase();
        return book.includes(searchValue) || verse.includes(searchValue);
      });
      let bookmarkedRow = filteredData[bookmarkedRowIndex];
      if (bookmarkedRow) {
        let bookmarkedRowElement = Array.from(document.querySelectorAll('#table1 tbody tr'))
          .find(row => row.children[0].textContent === bookmarkedRow.book && row.children[1].textContent === bookmarkedRow.verse);
        if (bookmarkedRowElement) {
          bookmarkedRowElement.scrollIntoView();
          bookmarkedRowElement.classList.add('highlighted');
          setTimeout(() => bookmarkedRowElement.classList.remove('highlighted'), 3000);
        } else {
          alert(`Bookmark not found on this exact page, but here's your last bookmark: ${bookmarkedRow.book} ${bookmarkedRow.verse}`);
        }
      } else {
        alert('Bookmark not found');
      }
    } else {
      alert('No bookmark has been set yet');
    }
  });
  
  bookmarksSection.appendChild(bookmarksButton);

  // add a button to the "Bookmarks" section to reset the bookmark
  let resetButton = document.createElement('button');
  resetButton.textContent = 'Reset Bookmark';
  resetButton.addEventListener('click', () => {
    localStorage.removeItem('table1Bookmark');
    alert('Bookmark reset');
  });
  bookmarksSection.appendChild(resetButton);

  let totalPages = Math.ceil(filteredData.length / 10);
  let currentPage = page;
  document.querySelector('#page1').textContent = `${currentPage} of ${totalPages}`;
}


//*******/
function searchTable1() {
  populateTable1(1);
}

function nextPage1() {
  let currentPage = parseInt(document.querySelector('#page1').textContent.split(' ')[0]);
  let totalPages = Math.ceil(data1.length / 5);
  if (currentPage < totalPages) {
    populateTable1(currentPage + 1);
  }
}

function prevPage1() {
  let currentPage = parseInt(document.querySelector('#page1').textContent.split(' ')[0]);
  if (currentPage > 1) {
    populateTable1(currentPage - 1);
  }
}


// Functions for populating table 2
function populateTable2(page) {
  let tableBody = document.querySelector('#table2 tbody');
  tableBody.innerHTML = '';
  let startIndex = (page - 1) * 10;
  let endIndex = startIndex + 10;
  let pageData = data2.slice(startIndex, endIndex);
  pageData.forEach(row => {
    let tr = document.createElement('tr');
    let tdQuestion = document.createElement('td');
    tdQuestion.textContent = row.Question;
    let tdAnswer = document.createElement('td');
    tdAnswer.textContent = row.Answer;
    tr.appendChild(tdQuestion);
    tr.appendChild(tdAnswer);
    tableBody.appendChild(tr);
  });
  let totalPages = Math.ceil(data2.length / 10);
  let currentPage = page;
  document.querySelector('#page2').textContent = `${currentPage} of ${totalPages}`;
}

function nextPage2() {
	let currentPage = parseInt(document.querySelector('#page2').textContent.split(' ')[0]);
	let totalPages = Math.ceil(data2.length / 10);
	if (currentPage < totalPages) {
		populateTable2(currentPage + 1);
	}
}

function prevPage2() {
	let currentPage = parseInt(document.querySelector('#page2').textContent.split(' ')[0]);
	if (currentPage > 1) {
		populateTable2(currentPage - 1);
	}
}