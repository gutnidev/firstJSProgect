const tasks = [

];

(function (arrOfTasks) {
  //! Объявления элементов и других переменных(начало скрипта)
  const ul = document.querySelector(`#ulTaskList`);
  const  form = document.forms[`addTask`];
  const inputTitle = form.elements[`inputTitile`];
  const inputBody = form.elements[`inputBody`];
  const showTaskBar = document.querySelector(`.rowForShowTask`);

  
//? Массив объектов превращаем в объекст объектов
  const objOfTasks = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});


  /*//todo Фу-ция вывода всего на страницу в случае, если я получу пачку задач объектом не через форму
  function renderAllTasks(tasksList) {
    //? Проверяем передан ли объект с задачами как аргумент ф-ции
    if(!tasksList){
      console.error('Не был передан объект с объектами задач');
      return;
    }
    
    //? Создаем фрагмент, с помощью которого будем пушить все "li" на станичку
    const fragment = document.createDocumentFragment();
    
    //? Перебираем наши задачи и на каждой итерации, получая отдельный объект с задачей, запускаем функцию, которая создает и возвращает li
    Object.values(tasksList).forEach(taskObj => {
      const li = createLi(taskObj);
      //? На каждой итерации запихиваю li в фрагмент, который я передам в DOM
      fragment.appendChild(li);
      ul.appendChild(fragment);
    });
    
  }*/
  
  //todo Ф-ция, с помощью которой я делаю li
  function createLi({_id, title, body} = {}) {
    const li = document.createElement('li');
    
    //? наполняю элемент li классами как в html
    li.classList.add(`list-group-item`, `align-items-center`, `flex-wrap`, `mt-2`);
    li.setAttribute(`data-taskId`, _id);
    
    
    //? Создаю содержимое li
    //? div рядка row li>rw
    const divRow = document.createElement(`div`);
    divRow.classList.add(`row`);
    
    //? div колонки с кнопками li>rw>col
    const divBtnCol = document.createElement(`div`);
    divBtnCol.classList.add(`col-12`, `d-flex`);
    
    //? помещаю divBtnCol в свой divRow
    divRow.appendChild(divBtnCol);
    
    //? div блок, группирующий кнопки li>rw>col>btnGroup
    const divBtnGroup = document.createElement(`div`);
    divBtnGroup.classList.add(`btn-group`, `ml-auto`);
    divBtnGroup.setAttribute(`role`, `group`);
    divBtnGroup.setAttribute(`aria-label`, `taskButtons`);
    
    //? помещаю divBtnGroup в свой divBtnCol
    divBtnCol.appendChild(divBtnGroup);
    
    //? Кнопка удаления, которая будет входить в li>rw>col>btnGroup>deleteBtn
    const deleteButton = document.createElement('button');
    deleteButton.classList.add(`btn`, `btn-outline-danger`, `border`,`deleteBtn`);
    deleteButton.textContent = `Удалить задачу`;
    
    //? Кнопка завершения, которая будет входить в li>rw>col>btnGroup>completeBtn
    const completeBtn = document.createElement('button');
    completeBtn.classList.add(`btn`, `btn-outline-danger`, `border`, `completeBtn`);
    completeBtn.textContent = `Завершить задачу`;

    //? Кнопки в свой дивгруп
    divBtnGroup.insertAdjacentElement("afterbegin", completeBtn);
    divBtnGroup.insertAdjacentElement("beforeend", deleteButton);
    
    //? рядок col, который сожержит заголовок задачи и будет входить в li>rw>col
    const divColForTaskTitle = document.createElement(`div`);
    divColForTaskTitle.classList.add(`col-12`);
    
    //? Помещаю рядок col, который сожержит h5 задачи в свой divRow
    divRow.appendChild(divColForTaskTitle);
    
    //? h5, который будет входить в li>rw>col>h5
    const h5 = document.createElement(`h5`);
    h5.classList.add(`task-title`, `mt-1`);
    h5.textContent = title;
    
     //? Помещаю h5, который сожержит заголовок задачи в свой divColForTaskTitle
    divColForTaskTitle.appendChild(h5);
    
    //? рядок col, который сожержит тело задачи и будет входить в li>rw>col
    const divColForTaskBody = document.createElement(`div`);
    divColForTaskBody.classList.add(`col-12`, `mh-100`);
    
    //? Помещаю рядок col, который сожержит p задачи в свой divRow
    divRow.appendChild(divColForTaskBody);
    
    //? Параграф, который будет входить в li>rw>col>p
    const p = document.createElement(`p`);
    p.classList.add(`mt-2`,`w-100`);
    p.textContent = body;
    
    //? Помещаю p, который сожержит p задачи в свой divColForTaskBody
    divColForTaskBody.appendChild(p);
    
    //? Запихиваю элементы в li
    li.appendChild(divRow);
    
    
    return li;
  }
  
  //todo Функция обработки SUBMIT на форме
  function formSubmitHandler(e){
    e.preventDefault();//? Предотвращаем перезагрузку странички при нажатии на SUBMIT
    
    const inputTitleValue = inputTitle.value;
    const inputBodyValue = inputBody.value;
    if(!inputTitleValue || !inputBodyValue){
      alert('Заполните форму');
      return;
    }
      const task = createTask(inputTitleValue, inputBodyValue);
      ul.insertAdjacentElement("afterbegin", createLi(task));
      form.reset();
      showUnCompletedLi();
      activateShowButton(e);
  }
  
  //todo Функция формирует объект из полученных данных от формы
  function createTask(title, body){
    const NewTask = {
      _id: `${(~~(Math.random()*1e8)).toString(16)}`,
      title: title,
      body: body,
      completed: false,
    };
    objOfTasks[NewTask._id] = NewTask;
    
    return JSON.parse(JSON.stringify(NewTask));
  }
  
  //todo Функция удаления задачи по нажатию на deleteBtn
  function clickDeleteBtn(e){
    
    if (e.target.classList.contains(`deleteBtn`)) {
      const parent = e.target.closest(`[data-taskid]`);
      const id = parent.dataset.taskid;
      deleteTask(id, parent);
      
    }else {
      
      return false;
    }
  }
  //todo Вспомогательная функция,которая просто удаляет элемент с DOM и удаляет с объекта
  function deleteTask(idToDelete, parentToDelete){
    parentToDelete.remove();
    delete objOfTasks[idToDelete];
}


  //todo Функция-хендлер обработки клика по кнопке completeBtn
  function clickCompleteBtn(e){
    if (e.target.classList.contains(`completeBtn`)){
       const parentList = e.target.closest(`[data-taskid]`);
       const id = parentList.dataset.taskid;
       
       completeToTaskList(id);
       coloredCompletedTask(parentList);
       deleteButton(e);
    }else {
      return false;
    }
  }
  
  //todo Функция записи завершенности задачи в объект объектов при нажатии на завершение задачи
  function completeToTaskList(id){
      objOfTasks[id].completed = true;
  }
  
  //todo Ф-ция подсвечивания заверенной задачи
  function coloredCompletedTask(parentList){
    parentList.style.backgroundColor = `#9f88444d`;
    parentList.classList.add(`order-last`);
  }
  
  //todo Функция-хендлер обработки клика по кнопке showCompletedTasks
  function showCompletedTasks(e){
    if (e.target.classList.contains(`showCompletedBtn`)){
        activateShowButton(e);
       let arrOfCompletedTasksId =  arrOfIdCompletedTasks();
       if (!arrOfCompletedTasksId.length) return false;
       hideUnCompletedLi(arrOfCompletedTasksId);
       
    }else {
      return false;
    }
  }
  //todo Ф-ция, которая вернет массив id-шников незавершенных задач
  function arrOfIdCompletedTasks(){
    if (!Object.keys(objOfTasks).length) return false;
    const arrOfKeys = Object.keys(objOfTasks);
    
    return  arrOfKeys.filter(key => !objOfTasks[key].completed);
  }
  
  //todo Ф-ция, которая спрячет li незавершенных задач
  function hideUnCompletedLi(arr){
  let liArr = Array.from(document.getElementsByClassName(`list-group-item`));
  for(let li of liArr){
    if(!objOfTasks[li.dataset.taskid].completed && !li.classList.contains(`d-none`)){
      li.classList.add(`d-none`);
    }
  }
  }
  
  //todo Функция-хендлер обработки клика по кнопке showAllBtn
  function showAllTasks(e){
    if (e.target.classList.contains(`showAllBtn`)){
      activateShowButton(e);
      let arrOfCompleted = arrOfIdCompletedTasks();
      if (!arrOfCompleted.length) return false;
      showUnCompletedLi(arrOfCompleted);
      
    }
  }
  
  //todo Ф-ция, которая покажет li незавершенных
  function showUnCompletedLi(){
  let liArr = Array.from(document.getElementsByClassName(`list-group-item`));
  for(let li of liArr){
    if(!objOfTasks[li.dataset.taskid].completed && li.classList.contains(`d-none`)){
      li.classList.remove(`d-none`);
    }
  }
  }

  //todo активация кнопки
  function activateShowButton(e){
    const showCom = document.getElementsByClassName(`showCompletedBtn`)[0];
    const showAll = document.getElementsByClassName(`showAllBtn`)[0];
    if(e.target.classList.contains(`showAllBtn`) && (!e.target.classList.contains(`active`))){
      showAll.classList.add(`active`);
      deactivateShowButton(e,showAll,showCom);
    }else if (e.target.classList.contains(`showCompletedBtn`) && (!e.target.classList.contains(`active`))){
      showCom.classList.add(`active`);
      deactivateShowButton(e,showAll,showCom);
    }else if(!showAll.classList.contains(`active`)){
      if(showCom.classList.contains(`active`)){showCom.classList.remove(`active`);}
      showAll.classList.add(`active`);
      
    }
    
  }
  
  //todo деакивация кнопки
  function deactivateShowButton(e,...rest){
    if(e.target.classList.contains(`showCompletedBtn`) && (rest[0].classList.contains(`active`))){
      rest[0].classList.remove(`active`);
    }else if(e.target.classList.contains(`showAllBtn`) && (rest[1].classList.contains(`active`))){
      rest[1].classList.remove(`active`);
    }
  }
  
  //todo удаление элемента при нажатии на него
  function deleteButton(e){
    e.target.remove();
  }
  
//! Тут вызываем все ф-ции и подписываемся на события
form.addEventListener(`submit`,formSubmitHandler);
ul.addEventListener(`click`, clickDeleteBtn);
ul.addEventListener(`click`, clickCompleteBtn);
showTaskBar.addEventListener(`click`, showCompletedTasks);
showTaskBar.addEventListener(`click`, showAllTasks)

})(tasks);
