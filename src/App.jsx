/// Q1. 初始化旅客数据，增加更多的参数
const initialTravellers = [
  {
    id: 1,
    name: 'Jack',
    phone: '88885555',
    email: 'jack@example.com',
    bookingTime: new Date().toLocaleString(),
  },
  {
    id: 2,
    name: 'Rose',
    phone: '88884444',
    email: 'rose@example.com',
    bookingTime: new Date().toLocaleString(),
  },
];

// TravellerRow 组件 - 渲染表格中的一行
function TravellerRow(props) {
  const { traveller } = props;
  return (
    <tr>
      <td>{traveller.id}</td>
      <td>{traveller.name}</td>
      <td>{traveller.phone}</td>
      <td>{traveller.email}</td>
      <td>{traveller.bookingTime}</td>
    </tr>
  );
}

// Display 组件 - 显示旅客信息
function Display(props) {
  const travellerRows = props.travellers.map((traveller) => (
    <TravellerRow key={traveller.id} traveller={traveller} />
  ));

  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Booking Time</th>
        </tr>
      </thead>
      <tbody>
        {travellerRows}
      </tbody>
    </table>
  );
}

// Add 组件 - 添加旅客
class Add extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.addTraveller;
    const newTraveller = {
      id: this.props.travellers.length + 1,
      name: form.travellername.value,
      phone: form.travellerphone.value,
      email: form.travelleremail.value,
      bookingTime: new Date().toLocaleString(),
    };
    if (this.props.travellers.length < 10) { // 防止超过座位限制
      this.props.bookTraveller(newTraveller);
      form.travellername.value = '';
      form.travellerphone.value = '';
      form.travelleremail.value = '';
    } else {
      alert("No more available seats.");
    }
  }

  render() {
    return (
      <form name="addTraveller" onSubmit={this.handleSubmit}>
        <input type="text" name="travellername" placeholder="Name" required />
        <input type="text" name="travellerphone" placeholder="Phone" required />
        <input type="email" name="travelleremail" placeholder="Email" required />
        <button>Add</button>
      </form>
    );
  }
}

// Delete 组件 - 删除旅客
class Delete extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.deleteTraveller;
    const nameToDelete = form.travellername.value.trim();
    if (nameToDelete) {
      this.props.deleteTraveller(nameToDelete);
      form.travellername.value = '';
    } else {
      alert("Please enter a valid name.");
    }
  }

  render() {
    return (
      <form name="deleteTraveller" onSubmit={this.handleSubmit}>
        <input type="text" name="travellername" placeholder="Name" required />
        <button>Delete</button>
      </form>
    );
  }
}

// Homepage 组件 - 显示座位的可视化表示
class Homepage extends React.Component {
  render() {
    const totalSeats = 10;
    const occupiedSeats = this.props.travellers.length;
    const freeSeats = totalSeats - occupiedSeats;

    // 将座位分为两排显示
    const seatElements = [];
    for (let i = 0; i < totalSeats; i++) {
      const isOccupied = i < occupiedSeats;
      const seatStyle = {
        width: '40px',
        height: '40px',
        backgroundColor: isOccupied ? 'grey' : 'green',
        margin: '5px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'default',
      };
      seatElements.push(
        <button key={i} style={seatStyle} aria-label={isOccupied ? 'Occupied seat' : 'Free seat'}>
          {/* 按钮中不显示编号，只显示空 */}
        </button>
      );
    }

    // 分割成两排
    const firstRow = seatElements.slice(0, 5);
    const secondRow = seatElements.slice(5, 10);

    return (
      <div>
        <h2>Seat Availability</h2>
        <p>Total Seats: {totalSeats}</p>
        <p>Occupied Seats: {occupiedSeats}</p>
        <p>Free Seats: {freeSeats}</p>
        
        {/* 图例部分，标明颜色的含义 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: 'grey', marginRight: '5px' }}></div>
            <span>Occupied</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: 'green', marginRight: '5px' }}></div>
            <span>Free</span>
          </div>
        </div>

        {/* 显示座位状态 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            {firstRow}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {secondRow}
          </div>
        </div>
      </div>
    );
  }
}



// TicketToRide 主组件
class TicketToRide extends React.Component {
  constructor() {
    super();
    this.state = { travellers: initialTravellers, selector: 'home' };
    this.bookTraveller = this.bookTraveller.bind(this);
    this.deleteTraveller = this.deleteTraveller.bind(this);
    this.setSelector = this.setSelector.bind(this);
  }

  setSelector(value) {
    this.setState({ selector: value });
  }

  bookTraveller(newTraveller) {
    this.setState({ travellers: [...this.state.travellers, newTraveller] });
  }

  deleteTraveller(name) {
    this.setState({
      travellers: this.state.travellers.filter(
        (traveller) => traveller.name !== name
      ),
    });
  }

  render() {
    return (
      <div>
        <h1>Ticket To Ride</h1>
        <div>
          <button onClick={() => this.setSelector('home')}>Home</button>
          <button onClick={() => this.setSelector('display')}>Display Travellers</button>
          <button onClick={() => this.setSelector('add')}>Add Traveller</button>
          <button onClick={() => this.setSelector('delete')}>Delete Traveller</button>
        </div>
        <div>
          {this.state.selector === 'home' && <Homepage travellers={this.state.travellers} />}
          {this.state.selector === 'display' && <Display travellers={this.state.travellers} />}
          {this.state.selector === 'add' && <Add travellers={this.state.travellers} bookTraveller={this.bookTraveller} />}
          {this.state.selector === 'delete' && <Delete deleteTraveller={this.deleteTraveller} />}
        </div>
      </div>
    );
  }
}

const element = <TicketToRide />;
ReactDOM.render(element, document.getElementById('contents'));
