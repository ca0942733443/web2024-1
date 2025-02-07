const RB = ReactBootstrap;
const { Alert, Card, Button, Table } = ReactBootstrap;

class App extends React.Component {
  
  state = {
    scene: 0,
    user : null,
}
constructor(){
    super();
    firebase.auth().onAuthStateChanged((user)=>{
        if (user) {
          this.setState({user:user.toJSON()});
        }else{
          this.setState({user:null});
       }
    });    
}


google_login() {
    // Using a popup.
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    firebase.auth().signInWithPopup(provider);
}


google_logout(){
    if(confirm("Are you sure?")){
      firebase.auth().signOut();
    }
}

  
  title = (
    <Alert variant="info">
      <b>Work6 :</b> Firebase
    </Alert>
  );
  footer = (
    <div>
      By 663380158-8 นายดรัสวัต ยิ้มพิรัตน์ สาขา IT<br />
      College of Computing, Khon Kaen University
    </div>
  );
  state = {
    scene: 0,
    students: [],
    stdid: "",
    stdtitle: "",
    stdfname: "",
    stdlname: "",
    stdemail: "",
    stdphone: "",
  };






  render() {
    return (
      <Card>
        <Card.Header>{this.title}</Card.Header>
        <LoginBox user={this.state.user} app={this}></LoginBox>
          <Card.Body>
          <Button onClick={() => this.readData()}>Read Data</Button>
          <Button onClick={() => this.autoRead()}>Auto Read</Button>
          <div>
            <StudentTable data={this.state.students} app={this} />
          </div>
        </Card.Body>
        <Card.Footer>
          <b>เพิ่ม/แก้ไขข้อมูล นักศึกษา :</b>
          <br />
          <TextInput label="ID" app={this} value="stdid" style={{ width: 120 }} />
          <TextInput label="คำนำหน้า" app={this} value="stdtitle" style={{ width: 100 }} />
          <TextInput label="ชื่อ" app={this} value="stdfname" style={{ width: 120 }} />
          <TextInput label="สกุล" app={this} value="stdlname" style={{ width: 120 }} />
          <TextInput label="Email" app={this} value="stdemail" style={{ width: 150 }} />
          <TextInput label="Phone" app={this} value="stdphone" style={{ width: 120 }} />
          <Button onClick={() => this.insertData()}>Save</Button>
        </Card.Footer>
        <Card.Footer>{this.footer}</Card.Footer>
      </Card>
    );
  }

  autoRead() {
    db.collection("students").onSnapshot((querySnapshot) => {
      var stdlist = [];
      querySnapshot.forEach((doc) => {
        stdlist.push({ id: doc.id, ...doc.data() });
      });
      this.setState({ students: stdlist });
    });
  }

  readData() {
    db.collection("students")
      .get()
      .then((querySnapshot) => {
        var stdlist = [];
        querySnapshot.forEach((doc) => {
          stdlist.push({ id: doc.id, ...doc.data() });
        });
        this.setState({ students: stdlist });
      });
  }

  insertData() {
    db.collection("students")
      .doc(this.state.stdid)
      .set({
        title: this.state.stdtitle,
        fname: this.state.stdfname,
        lname: this.state.stdlname,
        phone: this.state.stdphone,
        email: this.state.stdemail,
      });
  }

  edit(std) {
    this.setState({
      stdid: std.id,
      stdtitle: std.title,
      stdfname: std.fname,
      stdlname: std.lname,
      stdemail: std.email,
      stdphone: std.phone,
    });
  }

  delete(std) {
    if (confirm("ต้องการลบข้อมูล")) {
      db.collection("students").doc(std.id).delete();
    }
  }
}


function LoginBox(props) {
  const u = props.user;
  const app = props.app;
  if (!u) {
      return <div><Button onClick={() => app.google_login()}>Login</Button></div>
  } else {
      return <div>
          <img src={u.photoURL} />
          {u.email}<Button onClick={() => app.google_logout()}>Logout</Button></div>
  }
}






function StudentTable({ data, app }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>รหัส</th>
          <th>คำนำหน้า</th>
          <th>ชื่อ</th>
          <th>สกุล</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((s) => (
          <tr key={s.id}>
            <td>{s.id}</td>
            <td>{s.title}</td>
            <td>{s.fname}</td>
            <td>{s.lname}</td>
            <td>{s.email}</td>
            <td>
              <EditButton std={s} app={app} />
              <DeleteButton std={s} app={app} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TextInput({ label, app, value, style }) {
  return (
    <label className="form-label">
      {label}:
      <input
        className="form-control"
        style={style}
        value={app.state[value]}
        onChange={(ev) => {
          var s = {};
          s[value] = ev.target.value;
          app.setState(s);
        }}
      />
    </label>
  );
}

function EditButton({ std, app }) {
  return <button onClick={() => app.edit(std)}>แก้ไข</button>;
}

function DeleteButton({ std, app }) {
  return <button onClick={() => app.delete(std)}>ลบ</button>;
}

const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />);

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCDEkdPoRpRRf4jaWG33fHkfXDync9ARk",
  authDomain: "web2567-d36a9.firebaseapp.com",
  databaseURL: "https://web2567-d36a9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "web2567-d36a9",
  storageBucket: "web2567-d36a9.firebasestorage.app",
  messagingSenderId: "586965921921",
  appId: "1:586965921921:web:02d1361912b740fe4f9d80",
  measurementId: "G-1RDGHEF89F"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
