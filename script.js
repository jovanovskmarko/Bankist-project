'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'js',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

//CODING CHALLENGE

//display functions
let userLoggedIn;
const displayMovements = function (userLoggedIn, sort = false) {
  const movements = userLoggedIn.movements;

  const movs = movements.slice().sort(function (a, b) {
    if (sort) return a - b;
    else return movements;
  });
  containerMovements.textContent = '';
  movs.forEach(function (mov, i) {
    const date = new Date(userLoggedIn.movementsDates[i]);
    const year = `${date.getFullYear()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const day = date.getDate();
    const displayDate = `${day}/${month}/${year}`;
    let type = '';
    if (mov > 0) {
      type = 'deposit';
    } else {
      type = 'withdrawal';
    }

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div><div class="movements__date">${displayDate}</div>
      <div class="movements__value">${mov}€</div>
    </div>
  `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displayBalance = function (userLoggedIn) {
  labelBalance.textContent = userLoggedIn.movements.reduce(function (
    acu,
    curr
  ) {
    return Number(acu) + Number(curr);
  });

  userLoggedIn.balance = Number(labelBalance.textContent);
};

const updateUI = function (user) {
  displayMovements(user, false);
  displayBalance(user);
};

//login event

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const username = inputLoginUsername.value;
  const pin = inputLoginPin.value;

  userLoggedIn = accounts.find(function (curr) {
    return curr.owner === username;
  });

  if (userLoggedIn?.pin === Number(pin)) {
    //DISPLAY UI AND WELCOME MESSAGE
    labelWelcome.textContent = `Welcome ${userLoggedIn.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    containerMovements.innerHTML = '';
    updateUI(userLoggedIn);
  }
});

//transfer event

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const receiverAcc = accounts.find(function (acc) {
    return acc.owner === inputTransferTo.value;
  });
  const amount = Number(inputTransferAmount.value);

  if (
    amount > 0 &&
    userLoggedIn.balance >= amount &&
    receiverAcc?.owner !== userLoggedIn.owner &&
    receiverAcc
  ) {
    userLoggedIn.movements.push(0 - amount);
    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date().toISOString());
    userLoggedIn.movementsDates.push(new Date().toISOString());
  }

  inputTransferAmount.value = inputTransferTo.value = '';
});

//loan event
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = inputLoanAmount.value;
  if (
    amount > 0 &&
    userLoggedIn.movements.some(function (mov) {
      return mov >= amount * 0.1;
    })
  ) {
    userLoggedIn.movements.push(amount);
    userLoggedIn.movementsDates.push(new Date().toISOString());
    updateUI(userLoggedIn);
    inputLoanAmount.value = '';
  }
});

//close event
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputClosePin.value === userLoggedIn.pin.toString() &&
    inputCloseUsername.value === userLoggedIn.owner
  ) {
    let index = accounts.findIndex(function (acc) {
      return acc.owner === userLoggedIn.owner;
    });

    accounts.splice(index, 1);
    inputClosePin.value = inputCloseUsername.value = '';
    containerApp.style.opacity = 0;
  }
});

//sorting movements
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(userLoggedIn, !sorted);
  sorted = !sorted;
});

//FAKING LOG IN

const now = new Date();
const year = `${now.getFullYear()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const day = now.getDate();
const hour = now.getHours();
const min = now.getMinutes();

labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
