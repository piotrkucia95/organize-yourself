app.controller('TodosController', ['$scope', '$http', 'userService', function($scope, $http, userService) {

    $scope.getTodos = function(sortBy, isReverseSort) {
        $http.get('/todos/get')
        .then((result) => {
            $scope.todos = result.data;
            for(var todo of $scope.todos) {
                todo.date = new Date(todo.date);
            }
            sortBy ? $scope.sortTableBy(sortBy, isReverseSort) : $scope.sortTableBy('date');
            $scope.countPages();
        })
        .catch((err) => {});
    }

    $scope.isEditVisible = [];
    $scope.getTodos();

    $scope.addTodo = function() {
        if(!$scope.newTodo || !$scope.newTodo.name || !$scope.newTodo.date) {
            $scope.showToast('error', 'Task name and date cannot be empty!');
            return;
        }
        
        $scope.newTodo.done = false;
        $http.post('/todos/add', $scope.newTodo)
        .then((result) => {
            $scope.showToast('success', 'Todo added!');
            $scope.getTodos($scope.sortType, false);
            $scope.closeAddPanel();
        })
        .catch((err) => {
            $scope.showToast('error', 'Unknown error. Try again!');
        });
    }

    $scope.closeAddPanel = function() {
        $scope.isAddVisible = false;
        $scope.newTodo = {
            name: '',
            date: '',
            description: ''
        }
    }

    $scope.deleteTodo = function(todoId) {
        $http.delete('/todos/delete/' + todoId)
        .then((result) => {
            $scope.showToast('success', 'Todo deleted!');
            $scope.getTodos($scope.sortType, false);
        })
        .catch((err) => {
            $scope.showToast('error', 'Unknown error. Try again!');
        });
    }

    $scope.updateTodo = function(todo, index, isDoneChange) {
        if(!isDoneChange) {
            todo.name = $('#name-input-' + todo.id).val();
            var dateInput = $('#date-input-' + todo.id);
            todo.date = new Date(dateInput.val()) ? new Date(dateInput.val()) : $scope.todos[index].date;
            todo.description = $('#description-input-' + todo.id).val();
        } else {
            todo.done = !todo.done;
        } 

        if(!todo|| !todo.name || !todo.date) {
            $scope.showToast('error', 'Task name and date cannot be empty!');
            return;
        }

        $http.put('/todos/update', todo)
        .then((result) => {
            $scope.showToast('success', 'Todo updated!');
            $scope.isEditVisible[index] = false;
            $scope.getTodos($scope.sortType, false);
        })
        .catch((err) => {
            $scope.showToast('error', 'Unknown error. Try again!');
        });
    }

    $scope.sortReverse = false;

    $scope.sortTableBy = function(type, isReverseSort) {
        if(isReverseSort) $scope.sortReverse = !$scope.sortReverse;
        $scope.todos.sort(function(a, b) {
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
        var firstPage = (($scope.currentPage-1)*$scope.itemsPerPage)+1;
        var lastPage = $scope.currentPage * $scope.itemsPerPage;
        if($scope.todos.length == 0) firstPage = 0;
        if(lastPage > $scope.todos.length) lastPage = $scope.todos.length;
        if(firstPage > lastPage) {
            firstPage -= $scope.itemsPerPage;
            $scope.currentPage--;
        }
        $('#page-counter').text(firstPage + " - " + lastPage + " of " + $scope.todos.length);
    }
    
    $scope.prevPage = function() {
        if($scope.currentPage == 1) return;
        $scope.currentPage = $scope.currentPage-1;
        $scope.countPages();
    }
    
    $scope.nextPage = function() {
        if(($scope.currentPage*$scope.itemsPerPage) >= $scope.todos.length) return;
        $scope.currentPage = $scope.currentPage+1;
        $scope.countPages();
    }

    $scope.showToast = function(type, message) {
        console.log(message);
    }

}]);