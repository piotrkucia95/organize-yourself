app.controller('NotesController', ['$scope', '$http', 'userService', function($scope, $http, userService) {

    $scope.getNotes = function(sortBy, isReverseSort) {
        $http.get('/notes/get')
        .then((result) => {
            $scope.notes = result.data;
            sortBy ? $scope.sortTableBy(sortBy, isReverseSort) : $scope.sortTableBy('name');
            $scope.countPages();
        })
        .catch((err) => {});
    }

    $scope.isEditVisible = [];
    $scope.getNotes();

    $scope.addNote = function() {
        if(!$scope.newNote || !$scope.newNote.name) {
            $scope.showToast('error', 'Note name cannot be empty!');
            return;
        }
        
        $http.post('/notes/add', $scope.newNote)
        .then((result) => {
            $scope.showToast('success', 'Note added!');
            $scope.getNotes($scope.sortType, false);
            $scope.closeAddPanel();
        })
        .catch((err) => {
            $scope.showToast('error', 'Unknown error. Try again!');
        });
    }

    $scope.closeAddPanel = function() {
        $scope.isAddVisible = false;
        $scope.newNote = {
            name: '',
            note: ''
        }
    }

    $scope.deleteNote = function(noteId) {
        $http.delete('/notes/delete/' + noteId)
        .then((result) => {
            $scope.showToast('success', 'Note deleted!');
            $scope.getNotes($scope.sortType, false);
        })
        .catch((err) => {
            $scope.showToast('error', 'Unknown error. Try again!');
        });
    }

    $scope.showEditPanel = function(index) {
        var newline = String.fromCharCode(13, 10);
        $scope.notes[index].note = $scope.notes[index].note.split('\\n').join(newline);
        $scope.isEditVisible[index] = true;
    }

    $scope.updateNote = function(note, index) {
        note.name = $('#name-input-' + note.id).val();
        note.note = $('#note-input-' + note.id).val();

        var newline = String.fromCharCode(13, 10);
        note.note = note.note.split(newline).join('\\n');

        if(!note || !note.name) {
            $scope.showToast('error', 'Task name and date cannot be empty!');
            return;
        }

        $http.put('/notes/update', note)
        .then((result) => {
            $scope.showToast('success', 'Todo updated!');
            $scope.isEditVisible[index] = false;
            $scope.getNotes($scope.sortType, false);
        })
        .catch((err) => {
            $scope.showToast('error', 'Unknown error. Try again!');
        });
    }

    $scope.displayNoteModal = function(note) {
        if(note) {
            $('#modal-title').text(note.name);
            var noteParts = note.note.split('\\n');
            $('#modal-body').html(noteParts.join("<br/>"));
        }
    }

    $scope.sortReverse = false;

    $scope.sortTableBy = function(type, isReverseSort) {
        if(isReverseSort) $scope.sortReverse = !$scope.sortReverse;
        $scope.notes.sort(function(a, b) {
            var keyA = $scope.sortReverse ? b[type] : a[type];
            var keyB = $scope.sortReverse ? a[type]: b[type];
            // Compare the 2 dates
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
        });
        $scope.sortType = type;
    }

    $scope.currentPage = 1;
    $scope.itemsPerPage = 5;

    $scope.openFirstPage = function() {
        $scope.currentPage = 1; //reset to first page
        $scope.countPages();
    }
    
    $scope.countPages = function() {
        var firstPage = (($scope.currentPage-1) * $scope.itemsPerPage)+1;
        if($scope.notes.length == 0) firstPage = 0;
        var lastPage = $scope.currentPage * $scope.itemsPerPage;
        if(lastPage > $scope.notes.length) lastPage = $scope.notes.length;
        $('#page-counter').text(firstPage + " - " + lastPage + " of " + $scope.notes.length);
    }
    
    $scope.prevPage = function() {
        if($scope.currentPage == 1) return;
        $scope.currentPage = $scope.currentPage - 1;
        $scope.countPages();
    }
    
    $scope.nextPage = function() {
        if(($scope.currentPage * $scope.itemsPerPage) >= $scope.notes.length) return;
        $scope.currentPage = $scope.currentPage+1;
        $scope.countPages();
    }

    $scope.showToast = function(type, message) {
        console.log(message);
    }
}]);