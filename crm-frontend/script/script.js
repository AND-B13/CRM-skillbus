import { createdElement } from "./createdElement.js";

(function () {
  const $searchApp = document.getElementById('search');
  const $tableApp = document.getElementById('table-app');
  const $addButton = document.getElementById('add-btn');
  const $sortButtons = document.querySelectorAll('.table-head__button');
  const SERVER_URL = 'http://localhost:3000/api/clients';
  let isReversed = false;
  let timeoutId;

  // Получение данных c сервера
  async function serverGetAll() {
    const response = await fetch(`${SERVER_URL}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    return await response.json();
  }

  // Поиск определенных данных на сервере
  async function serverGetElementID(id) {
    const response = await fetch(`${SERVER_URL}/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 404) return '404';
    return await response.json();
  }

  async function requestSearch(query) {
    const response = await fetch(`${SERVER_URL}?search=${query}`),
      data = await response.json();
    createCRMApp(data);
  }

  // Добавление клиента на сервер и вызов новой отрисовки
  async function serverAdd(obj) {
    await fetch(`${SERVER_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj),
    })
    createCRMApp();
  }

  // Удаление клиента на сервере и вызов новой отрисовки
  async function serverDelete(id) {
    await fetch(`${SERVER_URL}/${id}`, {
      method: 'DELETE',
    })
    createCRMApp();
  }

  // Изменение существубщего клиента на сервере
  async function serverChange(obj, id) {
    await fetch(`${SERVER_URL}/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(obj),
      })
    createCRMApp();
  }

  // Вызвана из HTML, получает данные с сервера, если они есть отправляет по функциям
  async function createCRMApp(sortClientObj) {
    $tableApp.classList.add('table-main__body--load');
    $tableApp.innerHTML = '';
    const svgLoadElement = createLoadingSpinner($tableApp);
    if (!sortClientObj) {
      const serverData = await serverGetAll();
      if (serverData) {
        serverData.forEach(client => {
          createTableElement(client, $tableApp);
        })
        removeLoading(svgLoadElement);
      }
    } else {
      sortClientObj.forEach(client => {
        createTableElement(client, $tableApp);
      })
      removeLoading(svgLoadElement);
    }
  }

  function removeLoading(svgLoadElement) {
    setTimeout(() => {
      svgLoadElement.remove();
      $tableApp.classList.remove('table-main__body--load');
      $addButton.classList.remove('visually-hidden');
    }, 300);
  }

  // Создание спинера
  function createLoadingSpinner(container) {
    const $svgLoadSpin = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      $useLoadSpin = document.createElementNS('http://www.w3.org/2000/svg', 'use');

    $svgLoadSpin.classList.add('load-spinner');
    $useLoadSpin.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'img/svg/sprite-svg.svg#spin-load');

    $svgLoadSpin.append($useLoadSpin);
    container.append($svgLoadSpin);

    return $svgLoadSpin;
  }

  // Создание табицы и событий в ней.
  function createTableElement(client, container) {
    const $trBody = createdElement({
      tagname: 'tr',
      class: 'table-body__tr',
      }),
      $tdId = createdElement({
        tagname: 'td',
        class: 'table-body__td',
      }),
      $tdFullName = createdElement({
        tagname: 'td',
        class: 'table-body__td',
      }),
      $tdDateCreate = createdElement({
        tagname: 'td',
        class: 'table-body__td',
      }),
      $tdDateChanges = createdElement({
        tagname: 'td',
        class: 'table-body__td',
      }),
      $tdContacts = createdElement({
        tagname: 'td',
        class: 'table-body__td',
      }),
      $tdButtonsWrap = createdElement({
        tagname: 'td',
        class: 'table-body__td',
      }),
      $idSpan = createdElement({
        tagname: 'span',
        class: 'table-body__data table-body__data--grey',
        text: client.id,
      }),
      $fullNameSpan = createdElement({
        tagname: 'span',
        class: 'table-body__data',
        text: `${client.surname} ${client.name} ${client.lastName}`,
      }),
      formatCreateDate = formatDate(client.createdAt),
      $dateCreate = createdElement({
        tagname: 'time',
        class: 'table-body__data',
        text: formatCreateDate.formattedDate,
      }),
      $dateCreateTime = createdElement({
        tagname: 'span',
        class: 'table-body__data table-body__data--grey',
        text: formatCreateDate.time,
      }),
      formatChangeDate = formatDate(client.updatedAt),
      $dateChanges = createdElement({
        tagname: 'time',
        class: 'table-body__data',
        text: formatChangeDate.formattedDate,
      }),
      $dateChangesTime = createdElement({
        tagname: 'span',
        class: 'table-body__data table-body__data--grey',
        text: formatChangeDate.time,
      }),
      $buttonChange = createdElement({
        tagname: 'button',
        class: 'table-body__button btn-reset',
        attr: {
          'aria-label': 'Изменить данные клиента',
        },
      }),
      $svgChange = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      $useChange = document.createElementNS('http://www.w3.org/2000/svg', 'use'),
      $dataButtonChange = createdElement({
        tagname: 'span',
        class: 'table-body__text',
        text: 'Изменить',
      }),
      $buttonDelete = createdElement({
        tagname: 'button',
        class: 'table-body__button table-body__button--delete btn-reset',
        attr: {
          'aria-label': 'Удалить данные клиента',
        },
      }),
      $svgDelete = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      $useDelete = document.createElementNS('http://www.w3.org/2000/svg', 'use'),
      $svgLoadChange = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      $useLoadChange = document.createElementNS('http://www.w3.org/2000/svg', 'use'),
      $svgLoadDelete = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      $useLoadDelete = document.createElementNS('http://www.w3.org/2000/svg', 'use'),
      $dataButtonDelete = createdElement({
        tagname: 'span',
        class: 'table-body__text',
        text: 'Удалить',
      })

    $svgChange.classList.add('table-body__icon', 'table-body__icon--change');
    $svgDelete.classList.add('table-body__icon', 'table-body__icon--delete');
    $svgLoadChange.classList.add('table-body__icon', 'table-body__icon--hidden', 'table-body__icon--load', 'table-body__icon--load-change');
    $svgLoadDelete.classList.add('table-body__icon', 'table-body__icon--hidden', 'table-body__icon--load', 'table-body__icon--load-delete');
    $useChange.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'img/svg/sprite-svg.svg#change');
    $useDelete.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'img/svg/sprite-svg.svg#delete');
    $useLoadChange.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'img/svg/sprite-svg.svg#load-btn');
    $useLoadDelete.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'img/svg/sprite-svg.svg#load-btn');

    if (client.contacts.length !== 0) {
      renderSortedContacts($tdContacts, client.contacts);
    }

    tableEvents(client.id, $buttonChange, $svgChange, $buttonDelete, $svgDelete, $svgLoadChange, $svgLoadDelete);

    $tdId.append($idSpan);
    $tdFullName.append($fullNameSpan);
    $tdDateCreate.append($dateCreate, $dateCreateTime);
    $tdDateChanges.append($dateChanges, $dateChangesTime);
    $svgChange.append($useChange);
    $svgDelete.append($useDelete);
    $svgLoadChange.append($useLoadChange);
    $svgLoadDelete.append($useLoadDelete);
    $buttonChange.append($svgLoadChange, $svgChange, $dataButtonChange);
    $buttonDelete.append($svgLoadDelete, $svgDelete, $dataButtonDelete);
    $tdButtonsWrap.append($buttonChange, $buttonDelete);
    $trBody.append($tdId, $tdFullName, $tdDateCreate, $tdDateChanges, $tdContacts, $tdButtonsWrap);
    container.append($trBody);
  }

  // получение нужного формата даты
  function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear().toString()}`;
    const time = `${date.toTimeString().substring(0, 5)}`;
    return {
      formattedDate,
      time,
    };
  }

  // отрисовка контактых данных
  function renderSortedContacts(container, contactsArr) {
    const  $btnMoreIcon = createdElement({
      tagname: 'button',
      attr: {
        'aria-label': 'Открыть все контакты',
      },
    });
    let checkContacts = 0;

    if (contactsArr.length > 4) {
      $btnMoreIcon.classList.add('table-body__button-more', 'table-body__button-more', 'btn-reset');
      $btnMoreIcon.textContent = `+${contactsArr.length - 4}`;
    } else {
      $btnMoreIcon.classList.add('table-body__button-more', 'table-body__button-more--hidden', 'btn-reset');
    }

    $btnMoreIcon.addEventListener('click', () => {
      const hiddenItems = document.querySelectorAll('.table-body__link--hidden');
      hiddenItems.forEach(el => {
        el.classList.remove('table-body__link--hidden');
      })
      $btnMoreIcon.classList.add('table-body__button-more--hidden');
    })

    contactsArr.forEach(contact => {

      const $linkContact = createdElement({
        tagname: 'a',
        attr: {
          'aria-label': 'Контактные данные',
          },
        }),
        $svgContact = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        $useContact = document.createElementNS('http://www.w3.org/2000/svg', 'use');

      if (checkContacts < 4) {
        $linkContact.classList.add('table-body__link');
        checkContacts++;
      } else {
        $linkContact.classList.add('table-body__link', 'table-body__link--hidden');
        checkContacts++;
      }

      $svgContact.classList.add('table-body__contact-icon');

      $svgContact.append($useContact);
      $linkContact.append($svgContact);
      container.append($linkContact);

      switch (contact.type) {
        case 'tel':
          $linkContact.href = `tel:${contact.value}`;
          $useContact.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'img/svg/sprite-svg.svg#tel');
          tippy($linkContact, {
            content: formatNumber(contact.value),
          });
          break;
        case 'more-tel':
          $linkContact.href = `tel:${contact.value}`;
          $useContact.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'img/svg/sprite-svg.svg#more-tel');
          tippy($linkContact, {
            content: formatNumber(contact.value),
          });
          break;
        case 'email':
          $linkContact.href = `mailto:${contact.value}`;
          $useContact.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'img/svg/sprite-svg.svg#mail');
          tippy($linkContact, {
            content: `Email: ${contact.value}`,
          });
          break;
        case 'vk':
          $linkContact.href = contact.value;
          $linkContact.target = '_blank';
          $useContact.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'img/svg/sprite-svg.svg#vk');
          tippy($linkContact, {
            content: `VK: ${contact.value}`,
          });
          break;
        case 'facebook':
          $linkContact.href = contact.value;
          $linkContact.target = '_blank';
          $useContact.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'img/svg/sprite-svg.svg#fb');
          tippy($linkContact, {
            content: `Facebook: ${contact.value}`,
          });
          break;
      }
    })

    container.append($btnMoreIcon);
  }

  // События таблицы
  function tableEvents(id, btnChange, svgChange, btnDelete, svgDelete, svgLoadChange, svgLoadDelete) {

    btnChange.addEventListener('click', () => {
      window.location.hash = '';
      window.location.hash = id;

      svgChange.classList.add('table-body__icon--hidden');
      svgLoadChange.classList.remove('table-body__icon--hidden');

      removeClassAfterDelay(svgChange, svgLoadChange);
    })

    btnDelete.addEventListener('click', () => {
      createModalDelete(id);

      svgDelete.classList.add('table-body__icon--hidden');
      svgLoadDelete.classList.remove('table-body__icon--hidden');

      removeClassAfterDelay(svgDelete, svgLoadDelete);
    })
  }

  function removeClassAfterDelay(svgChange, svgLoad) {
    setTimeout(function() {
      svgChange.classList.remove('table-body__icon--hidden');
      svgLoad.classList.add('table-body__icon--hidden');
    }, 500);
  }


  // Форматирование номера телефона
  function formatNumber(phoneNumber) {
    const cleanNumber = phoneNumber.replace(/[^\d]/g, '');
    if (cleanNumber.length !== 11) {
      return phoneNumber;
    }

    return `+${cleanNumber.slice(0, 1)} (${cleanNumber.slice(1, 4)}) ${cleanNumber.slice(4, 7)}-${cleanNumber.slice(7, 9)}-${cleanNumber.slice(9)}`;
  }

  // создание модалки
  function createModalAdd(title = 'Новый клиент', deleteBtn = 'Отмена', clientObj = false) {

    const $modal = createdElement({
      tagname: 'div',
      class: 'modal',
      }),
      $modalWrapper = createdElement({
        tagname: 'div',
        class: 'modal__wrapper',
      }),
      $modalTitleWrapper = createdElement({
        tagname: 'div',
        class: 'modal__info',
      }),
      $modalTitle = createdElement({
        tagname: 'h2',
        class: 'modal__title',
        text: title,
      }),
      $modalIdSpan = createdElement({
        tagname: 'span',
        class: 'modal__id-data',
      }),
      $modalForm = createdElement({
        tagname: 'form',
        class: 'modal__form form-popup',
      }),
      $modalItemName = createdElement({
        tagname: 'div',
        class: 'form-popup__item',
      }),
      $labelName = createdElement({
        tagname: 'label',
        class: 'form-popup__label',
        text: 'Имя*',
      }),
      $inputName = createdElement({
        tagname: 'input',
        class: 'form-popup__input input-reset',
        attr: {
          'aria-label': 'Введите имя',
          name: 'name',
          type: 'text',
        },
      }),
      $modalItemSurname = createdElement({
        tagname: 'div',
        class: 'form-popup__item',
      }),
      $labelSurname = createdElement({
        tagname: 'label',
        class: 'form-popup__label',
        text: 'Фамилия*',
      }),
      $inputSurname = createdElement({
        tagname: 'input',
        class: 'form-popup__input input-reset',
        attr: {
          'aria-label': 'Введите Фамилию',
          name: 'surname',
          type: 'text',
        },
      }),
      $modalItemLastName = createdElement({
        tagname: 'div',
        class: 'form-popup__item',
      }),
      $labelLastName = createdElement({
        tagname: 'label',
        class: 'form-popup__label',
        text: 'Отчество',
      }),
      $inputLastName = createdElement({
        tagname: 'input',
        class: 'form-popup__input input-reset',
        attr: {
          'aria-label': 'Введите Отчество',
          name: 'lastname',
          type: 'text',
        },
      }),
      $contactAdd = createdElement({
        tagname: 'div',
        class: 'add-contact',
      }),
      $addContactButton = createdElement({
        tagname: 'button',
        class: 'add-contact__btn btn-reset',
        attr: {
          'aria-label': 'Добавить конактные данные',
        },
      }),
      $addSpan = createdElement({
        tagname: 'span',
        class: 'add-contact__topic',
        text: 'Добавить контакт',
      }),
      $svgAdd = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      $useAdd = document.createElementNS('http://www.w3.org/2000/svg', 'use'),
      $errorMessage = createdElement({
        tagname: 'p',
        class: 'form-popup__error-message',
      }),
      $saveButton = createdElement({
        tagname: 'button',
        class: 'form-popup__button-add btn btn-primary btn-reset',
        attr: {
          'aria-label': 'Сохранить данные',
          type: 'submit',
        },
      }),
      $saveSpan = createdElement({
        tagname: 'span',
        class: 'form-popup__topic',
        text: 'Сохранить',
      }),
      $svgSave = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      $useSave = document.createElementNS('http://www.w3.org/2000/svg', 'use'),
      $cancelButton = createdElement({
        tagname: 'button',
        class: 'modal__button-cancel btn-reset',
        text: deleteBtn,
        attr: {
          'aria-label': 'Отменить введенные изменения',
        },
      }),
      $modalCloseButton = createdElement({
        tagname: 'button',
        class: 'modal__button-close btn-reset',
        attr: {
          'aria-label': 'Закрыть форму ввода',
        },
      }),
      $svgClose = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      $useClose = document.createElementNS('http://www.w3.org/2000/svg', 'use');

    $svgAdd.classList.add('add-contact__icon');
    $svgSave.classList.add('form-popup__icon');
    $svgClose.classList.add('modal__icon');
    $useAdd.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'img/svg/sprite-svg.svg#delete');
    $useSave.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'img/svg/sprite-svg.svg#load-btn');
    $useClose.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'img/svg/sprite-svg.svg#close');


    const clientElement = {
      modal: $modal,
      modalWrapper: $modalWrapper,
      form: $modalForm,
      addContactBtn: $addContactButton,
      errorMessage: $errorMessage,
      saveBtn: $saveButton,
      cancelBtn: $cancelButton,
      closeBtn: $modalCloseButton,
      contactWrapper: $contactAdd,
      name: $inputName,
      surname: $inputSurname,
      lastName: $inputLastName,
      svgSave: $svgSave,
    }

    if (clientObj) {
      window.location.hash = clientObj.id;
      $modalIdSpan.textContent = `id: ${clientObj.id}`;
      $inputName.value = clientObj.name;
      $inputSurname.value = clientObj.surname;
      $inputLastName.value = clientObj.lastName;

      if (clientObj.contacts) {
        clientObj.contacts.forEach(contact => {
          createContactElement(clientElement.contactWrapper, contact)
        })
      }
    }

    modalEvents(clientElement, clientObj, clientObj.id, deleteBtn);

    $svgAdd.append($useAdd);
    $addContactButton.append($svgAdd, $addSpan);
    $svgSave.append($useSave);
    $saveButton.append($svgSave, $saveSpan);
    $contactAdd.append($addContactButton);
    $modalTitleWrapper.append($modalTitle, $modalIdSpan);
    $modalItemSurname.append($inputSurname, $labelSurname);
    $modalItemName.append($inputName, $labelName);
    $modalItemLastName.append($inputLastName, $labelLastName)
    $modalForm.append($modalItemSurname, $modalItemName, $modalItemLastName, $contactAdd, $errorMessage, $saveButton);
    $svgClose.append($useClose);
    $modalCloseButton.append($svgClose);
    $modalWrapper.append($modalTitleWrapper, $modalForm, $cancelButton, $modalCloseButton);
    $modal.append($modalWrapper);
    document.body.append($modal);

    checkContactElementsCount($addContactButton, 'add-contact__btn--disable', 10)
    modalVisibility($modalWrapper, $modal);
  }

  // создание блока контакты
  function createContactElement(container, objOptionsDefault = false) {
    const $wrapperContact = createdElement({
        tagname: 'div',
        class: 'add-contact__wrapper',
      }),
      $select = createdElement({
        tagname: 'select',
        class: 'add-contact__select',
      }),
      $optionsPhone = createdElement({
        tagname: 'option',
        class: 'add-contact__options',
        text: 'Телефон',
        attr: {
          value: 'tel',
        },
      }),
      $optionsMorePhone = createdElement({
        tagname: 'option',
        class: 'add-contact__options',
        text: 'Доп. телефон',
        attr: {
          value: 'more-tel',
        },
      }),
      $optionsEmail = createdElement({
        tagname: 'option',
        class: 'add-contact__options',
        text: 'Email',
        attr: {
          value: 'email',
        },
      }),
      $optionsVK = createdElement({
        tagname: 'option',
        class: 'add-contact__options',
        text: 'Vk',
        attr: {
          value: 'vk',
        },
      }),
      $optionsFacebook = createdElement({
        tagname: 'option',
        class: 'add-contact__options',
        text: 'Facebook',
        attr: {
          value: 'facebook',
        },
      }),
      $inputValueInfo = createdElement({
        tagname: 'input',
        class: 'add-contact__input input-reset',
        text: 'Facebook',
        attr: {
          placeholder: 'Введите данные контакта',
        },
      }),
      $deleteBtn = createdElement({
        tagname: 'button',
        class: 'add-contact__btn-delete btn-reset',
        attr: {
          'aria-label': 'Удалить контакт',
        },
      }),
      $svgDelete = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      $useDelete = document.createElementNS('http://www.w3.org/2000/svg', 'use');

    $svgDelete.classList.add('add-contact__icon-delete');
    $useDelete.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'img/svg/sprite-svg.svg#delete');

    if (objOptionsDefault) {
      const $defaultOption = document.createElement('option');
      $defaultOption.classList.add('add-contact__options');
      switch (objOptionsDefault.type) {
        case 'tel':
          $defaultOption.textContent = 'Телефон';
          $defaultOption.value = 'tel';
          $inputValueInfo.value = objOptionsDefault.value;
          $select.append($defaultOption);
          break;
        case 'more-tel':
          $defaultOption.textContent = 'Доп. телефон';
          $defaultOption.value = 'more-tel';
          $inputValueInfo.value = objOptionsDefault.value;
          $select.append($defaultOption);
          break;
        case 'email':
          $defaultOption.textContent = 'Email';
          $defaultOption.value = 'email';
          $inputValueInfo.value = objOptionsDefault.value;
          $select.append($defaultOption);
          break;
        case 'vk':
          $defaultOption.textContent = 'VK';
          $defaultOption.value = 'vk';
          $inputValueInfo.value = objOptionsDefault.value;
          $select.append($defaultOption);
          break;
        case 'facebook':
          $defaultOption.textContent = 'Facebook';
          $defaultOption.value = 'facebook';
          $inputValueInfo.value = objOptionsDefault.value;
          $select.append($defaultOption);
          break;
      }
    }

    $select.append($optionsPhone, $optionsMorePhone, $optionsEmail, $optionsVK, $optionsFacebook);
    $svgDelete.append($useDelete);
    $deleteBtn.append($svgDelete);
    $wrapperContact.append($select, $inputValueInfo, $deleteBtn);
    container.prepend($wrapperContact);

    createChoices($select);
    contactEvents($wrapperContact, container, $deleteBtn);
  }


  function checkContactElementsCount(addContactButton, classAdd, count) {
    const $contactWrapper = document.querySelectorAll('.add-contact__wrapper');

    if ($contactWrapper.length === count) {
      addContactButton.classList.add(classAdd);
    }
  }

  //Создание кастомного селектора
  function createChoices(select) {
    const choices = new Choices(select, {
      searchEnabled: false,
      position: 'down',
      allowHTML: true,
      itemSelectText: '',
      placeholder: false,
    });
  }

  // Ивент кнопки добавить клиента (не больше 10)
  function contactEvents(wrapper, container, deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      wrapper.remove();
      const contactWrapper = document.querySelectorAll('.add-contact__wrapper');
      if (contactWrapper.length === 9) {
        const addContactBtn = document.querySelector('.add-contact__btn');
        addContactBtn.classList.remove('add-contact__btn--disable');
      } else if (contactWrapper) {
        container.classList.remove('add-contact--open');
      }
    });
  }

  // события модалки
  function modalEvents(objElement, objClient, id) {
    objElement.form.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputName = document.querySelector('input[name="name"]');
      const inputSurname = document.querySelector('input[name="surname"]');
      const $inputLastName = document.querySelector('input[name="lastname"]');

      objElement.errorMessage.classList.remove('form-popup__error-message--active', 'centered');
      objElement.contactWrapper.classList.remove('add-contact--error');

      objElement.errorMessage.textContent = '';

      if(!validationNameInForm(inputName, objElement.errorMessage, objElement.contactWrapper, 'Имя должно', 'Имя не должно')) {
        return;
      }

      if(!validationNameInForm(inputSurname, objElement.errorMessage, objElement.contactWrapper, 'Фамилия должна', 'Фамилия не должна')) {
        return;
      }

      if($inputLastName.value !== '') {
        if(!validationNameInForm($inputLastName, objElement.errorMessage, objElement.contactWrapper, 'Отчество должно', 'Отчество не должно')) {
          return;
        }
      }

      const contactsWrapper = document.querySelectorAll('.add-contact__wrapper');

      const newClientObj = {
        name: objElement.name.value,
        surname: objElement.surname.value,
        lastName: objElement.lastName.value,
      };

      if (contactsWrapper) {
        const testValidationContacts = getSelectedContacts(contactsWrapper, objElement.errorMessage, objElement.contactWrapper);

        if (testValidationContacts) {
          newClientObj.contacts = testValidationContacts;
        } else {
          return;
        }
      }

      if (objClient) {
        serverChange(newClientObj, id);
      } else {
        serverAdd(newClientObj);
      }

      removeTimeout(objElement.modalWrapper, objElement.modal);
      }
    )

    objElement.addContactBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const contactWrapper = document.querySelectorAll('.add-contact__wrapper');
      if (contactWrapper.length < 10) {
        objElement.contactWrapper.classList.add('add-contact--open');
        createContactElement(objElement.contactWrapper);
      }

      if (contactWrapper.length === 9) {
        objElement.addContactBtn.classList.add('add-contact__btn--disable');
      }
    })

    objElement.cancelBtn.addEventListener('click', () => {
      window.location.hash = '';
      removeTimeout(objElement.modalWrapper, objElement.modal);
      createModalDelete(id, 'modal');
    });

    objElement.closeBtn.addEventListener('click', () => {
      window.location.hash = '';
      createCRMApp();
      removeTimeout(objElement.modalWrapper, objElement.modal);
    });

    objElement.saveBtn.addEventListener('click', () => {
      objElement.svgSave.classList.add('form-popup__icon--active');
      setTimeout(function() {
        objElement.svgSave.classList.remove('form-popup__icon--active');
      }, 300);
    })
  }

  function validationNameInForm(inputFields, errorMessage, contactWrapper, textErroreOne, textErroreTwo) {
    inputFields.classList.remove('form-popup__input--error')

    if(inputFields.value === '') {
      addClassListErroreMassage(errorMessage, contactWrapper, inputFields, 'form-popup__input--error');


      errorMessage.textContent = `Не заполнено одно из обязательных полей для ввода`;
      return false;
    }

    if(inputFields.value.length < 2) {
      addClassListErroreMassage(errorMessage, contactWrapper, inputFields, 'form-popup__input--error');

      errorMessage.textContent = `${textErroreOne} стостоять из двух или более букв.`;
      return false;
    }

    if(inputFields.value.length >= 30) {
      addClassListErroreMassage(errorMessage, contactWrapper, inputFields, 'form-popup__input--error');

      errorMessage.textContent = `${textErroreTwo} стостоять более чем из тридцати букв.`;
      return false;
    }

    if (/\d/.test(inputFields.value) || /[^a-zA-ZА-Яа-я]/.test(inputFields.value)) {
      addClassListErroreMassage(errorMessage, contactWrapper, inputFields, 'form-popup__input--error');

      errorMessage.textContent = 'В поле для ввода есть цифры или другие символы';
      return false;
    }

    return true;
  }

  function validationContactInForm(typeContact, inputContact, inputValue, errorMessage, contactWrapper) {
    inputContact.classList.remove('add-contact__input--error');

    if(typeContact === 'tel') {
      if(inputValue === '') {
        addClassListErroreMassage(errorMessage, contactWrapper, inputContact, 'add-contact__input--error');

        errorMessage.textContent = 'Нужно заполнить контакнтые данные или удалить';
        return false;
      }

      if(inputValue.length !== 11) {
        addClassListErroreMassage(errorMessage, contactWrapper, inputContact, 'add-contact__input--error');

        errorMessage.textContent = 'Не верно введен номер телефона';
        return false;
      }

      if(!/^[0-9]+$/.test(inputValue)) {
        addClassListErroreMassage(errorMessage, contactWrapper, inputContact, 'add-contact__input--error');

        errorMessage.textContent = 'В поле телефон возможно вводить только цифры';
        return false;
      }

      if(!inputValue.startsWith('89')) {
        addClassListErroreMassage(errorMessage, contactWrapper, inputContact, 'add-contact__input--error');

        errorMessage.textContent = 'Номер телефона должен начинаться с 8-9..';
        return false;
      }
    } else if(typeContact === 'more-tel') {
      if(inputValue === '') {
        addClassListErroreMassage(errorMessage, contactWrapper, inputContact, 'add-contact__input--error');

        errorMessage.textContent = 'Нужно заполнить контакнтые данные или удалить';
        return false;
      }

      if(inputValue.length !== 11) {
        addClassListErroreMassage(errorMessage, contactWrapper, inputContact, 'add-contact__input--error');

        errorMessage.textContent = 'Не верно введен номер телефона';
        return false;
      }

      if(!/^[0-9]+$/.test(inputValue)) {
        addClassListErroreMassage(errorMessage, contactWrapper, inputContact, 'add-contact__input--error');

        errorMessage.textContent = 'В поле телефон возможно вводить только цифры';
        return false;
      }

      if(!inputValue.startsWith('89') && !inputValue.startsWith('84')) {
        addClassListErroreMassage(errorMessage, contactWrapper, inputContact, 'add-contact__input--error');

        errorMessage.textContent = 'Номер телефона должен начинаться с 8-9.. или 8-4..';
        return false;
      }
    } else if(typeContact === 'email') {
      if(inputValue === '') {
        addClassListErroreMassage(errorMessage, contactWrapper, inputContact, 'add-contact__input--error');

        errorMessage.textContent = 'Нужно заполнить контакнтые данные или удалить';
        return false;
      }


      if(/[а-яА-Я]/.test(inputValue)) {
        addClassListErroreMassage(errorMessage, contactWrapper, inputContact, 'add-contact__input--error');

        errorMessage.textContent = 'Можно использховать только буквы от A-z, цифры или спец. символы';
        return false;
      }

      if(!inputValue.includes('@')) {
        addClassListErroreMassage(errorMessage, contactWrapper, inputContact, 'add-contact__input--error');

        errorMessage.textContent = 'Не верный формат почты';
        return false;
      }

      if(!inputValue.includes('.ru')) {
        addClassListErroreMassage(errorMessage, contactWrapper, inputContact, 'add-contact__input--error');

        errorMessage.textContent = 'Не верный формат почты';
        return false;
      }

    } else if(typeContact === 'facebook') {
      if(inputValue === '') {
        addClassListErroreMassage(errorMessage, contactWrapper, inputContact, 'add-contact__input--error');

        errorMessage.textContent = 'Нужно заполнить контакнтые данные или удалить';
        return false;
      }

      if(/[а-яА-Я]/.test(inputValue)) {
        addClassListErroreMassage(errorMessage, contactWrapper, inputContact, 'add-contact__input--error');

        errorMessage.textContent = 'Можно использховать только буквы от A-z, цифры или спец. символы';
        return false;
      }

    } else if (typeContact === 'vk') {
      if(inputValue === '') {
        addClassListErroreMassage(errorMessage, contactWrapper, inputContact, 'add-contact__input--error');

        errorMessage.textContent = 'Нужно заполнить контакнтые данные или удалить';
        return false;
      }

      if(/[а-яА-Я]/.test(inputValue)) {
        addClassListErroreMassage(errorMessage, contactWrapper, inputContact, 'add-contact__input--error');

        errorMessage.textContent = 'Можно использховать только буквы от A-z, цифры или спец. символы';
        return false;
      }
    }

    return true;
  }

  function addClassListErroreMassage(errorMessage, contactWrapper, inputContact, errorClass) {
    inputContact.classList.add(errorClass)
    errorMessage.classList.add('form-popup__error-message--active', 'centered');
    contactWrapper.classList.add('add-contact--error');
  }

  // Формирование контактов для хранения на сервере
  function getSelectedContacts(contactsWrapper, errorMessage, contactWrapper ) {
    const contactObj = [];

    errorMessage.classList.remove('form-popup__error-message--active', 'centered');
    contactWrapper.classList.remove('add-contact--error');

    errorMessage.textContent = '';

    contactsWrapper.forEach(contact => {
      const selectValue = contact.querySelector('.add-contact__select').value;
      const inputValue = contact.querySelector('.add-contact__input').value;
      const inputContact = contact.querySelector('.add-contact__input');

      const validation = validationContactInForm(selectValue, inputContact, inputValue, errorMessage, contactWrapper);

      if(!validation) {
        return;
      }

      return contactObj.push({
        type: selectValue,
        value: inputValue,
      })
    })

    if(contactObj.length === contactsWrapper.length) {
      return contactObj;
    } else {
      return false;
    }
  }

  // Плавное исчезновение модалки
  function removeTimeout(modalWrapper, modal) {
    modalVisibility(modalWrapper, modal)
    setTimeout(() => {
      modal.remove();
    }, 400);
  };

  // Плавное появление модалки
  function modalVisibility(modalWrapper, modal) {
    setTimeout(() => {
      modal.classList.toggle('modal--active');
      modalWrapper.classList.toggle('modal__wrapper--active');
    }, 200);
  }

  // проверка на существованеи модалки
  function checkModalFormAvailability() {
    const modal = document.querySelector('.modal');
    if (modal) {
      const modalWrapper = document.querySelector('.modal__wrapper');
      removeTimeout(modal, modalWrapper)
    }
  }

  function createModalDelete(id, callingContext = 'table') {
    const $modal = createdElement({
        tagname: 'div',
        class: 'modal',
      }),
      $modalWrapper = createdElement({
        tagname: 'div',
        class: 'modal__wrapper',
      }),
      $modalTitleWrapper = createdElement({
        tagname: 'div',
        class: 'modal__info',
      }),
      $modalTitle = createdElement({
        tagname: 'h2',
        class: 'modal__title',
        text: 'Удалить клиента',
      }),
      $modalText = createdElement({
        tagname: 'p',
        class: 'modal__descr centered',
        text: 'Вы действительно хотите удалить данного клиента?',
      }),
      $modalCloseButton = createdElement({
        tagname: 'button',
        class: 'modal__button-close btn-reset',
      }),
      $svgClose = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      $useClose = document.createElementNS('http://www.w3.org/2000/svg', 'use'),
      $deleteButton = createdElement({
        tagname: 'button',
        class: 'modal__btn-delete btn btn-primary btn-reset',
        text: 'Удалить',
        attr: {
          'aria-label': 'Удалить данные',
        },
      }),
      $cancelButton = createdElement({
        tagname: 'button',
        class: 'modal__button-cancel btn-reset',
        text: 'Отмена',
        attr: {
          'aria-label': 'Отменить удаление данных',
        },
      });

      $svgClose.classList.add('modal__icon');
      $useClose.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'img/svg/sprite-svg.svg#close');

      const modalInfoElement = {
        modal: $modal,
        modalWrapper: $modalWrapper,
        cancelBtn: $cancelButton,
        deleteButton: $deleteButton,
        modalCloseButton: $modalCloseButton,
      };

      modalDeleteEvents(id, modalInfoElement, callingContext);

      $svgClose.append($useClose)
      $modalCloseButton.append($svgClose)
      $modalTitleWrapper.append($modalTitle, $modalText, $deleteButton, $cancelButton, $modalCloseButton)
      $modalWrapper.append($modalTitleWrapper)
      $modal.append($modalWrapper);
      document.body.append($modal);

      modalVisibility($modalWrapper, $modal);
  }

  function modalDeleteEvents(id, modalElement, callingContext) {

    modalElement.cancelBtn.addEventListener('click', () => {

      callingContext !== 'table' ? window.location.hash = `${id}`: createCRMApp();

      removeTimeout(modalElement.modalWrapper, modalElement.modal);
    });

    modalElement.modalCloseButton.addEventListener('click', () => {
      createCRMApp();
      removeTimeout(modalElement.modalWrapper, modalElement.modal);
    });

    modalElement.deleteButton.addEventListener('click', () => {
      serverDelete(id);
      removeTimeout(modalElement.modalWrapper, modalElement.modal);
    })
  }

  // function modalError() {
  //   const $modal = createdElement({
  //     tagname: 'div',
  //     class: 'modal',
  //   }),
  //   $modalWrapper = createdElement({
  //     tagname: 'div',
  //     class: 'modal__wrapper',
  //   }),
  //   $modalTitleWrapper = createdElement({
  //     tagname: 'div',
  //     class: 'modal__info',
  //   }),
  //   $modalTitle = createdElement({
  //     tagname: 'h2',
  //     class: 'modal__title',
  //     text: 'Непредвиденная ошибка:(',
  //   }),
  //   $modalText = createdElement({
  //     tagname: 'p',
  //     class: 'modal__descr',
  //     text: 'Сервис временно недоступен, попробуйте зайти позже',
  //   });

  //   $modalTitleWrapper.append($modalTitle, $modalText);
  //   $modalWrapper.append($modalTitleWrapper)
  //   $modal.append($modalWrapper);
  //   document.body.append($modal);
  // }

  // сортировка массива
  function cliantSort(clients, prop) {
    if (prop === 'id') {
      clients.sort(function (a, b) {
        return a.id - b.id;
      });

      if (isReversed) {
        clients.reverse();
        isReversed = false;
      } else {
        isReversed = true;
      }

      createCRMApp(clients);

    } else if (prop === 'name') {
      clients.sort((a, b) => {
        let nameComparison = a.name.localeCompare(b.name);
        if (nameComparison !== 0) {
          return nameComparison;
        }

        let surnameComparison = a.surname.localeCompare(b.surname);
        if (surnameComparison !== 0) {
          return surnameComparison;
        }

        return a.lastName.localeCompare(b.lastName);
      });

      if (isReversed) {
        clients.reverse();
        isReversed = false;
      } else {
        isReversed = true;
      }

      createCRMApp(clients);

    } else if (prop === 'created') {
      sortDateTime(clients, 'createdAt');
    } else if (prop === 'updated') {
      sortDateTime(clients, 'updatedAt');
    }

    function sortDateTime(clients, prop) {
      clients.sort((a, b) => {
        return new Date(b[prop]) - new Date(a[prop]);
      });

      if (isReversed) {
        clients.reverse();
        isReversed = false;
      } else {
        isReversed = true;
      }

      createCRMApp(clients);
    }
  }

  // Поиск клиента через поисковую строку с #
  window.addEventListener('hashchange', async () => {
    const hashString = window.location.hash;
    if (window.location.hash !== '') {
      const id = hashString.slice(1);
      const serverDataID = await serverGetElementID(id);
      if (serverDataID === '404') {
        checkModalFormAvailability();
        console.log('Клиент не найден');
      } else {
        checkModalFormAvailability();
        createModalAdd('Изменить данные', 'Удалить клиента', serverDataID);
      }
    }
  }
  );

  // Событие поиска
  $searchApp.addEventListener('input', () => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      requestSearch($searchApp.value);
    }, 300);
  });

  // Событие отскрытия модалки для добавления нового клиента
  $addButton.addEventListener('click', () => {
    checkModalFormAvailability();
    createModalAdd();
  });

  $sortButtons.forEach(sortButton => {
    sortButton.addEventListener('click', async () => {
      const serverData = await serverGetAll();
      if (serverData) {
        $tableApp.innerHTML = '';
        cliantSort([...serverData], sortButton.dataset.sortBy);
      }
    })
  })

  window.createCRMApp = createCRMApp;
})();
