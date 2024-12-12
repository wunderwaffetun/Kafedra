import React from 'react';
import ReactDOM from 'react-dom';
import './bootstrap/css/bootstrap.min.css';
import './bootstrap/js/bootstrap.bundle.min.js'
import Table from './components/Table';


const App = () => {
  return (
    <div className="" style={{ fontSize: '14px' }}>
      <Table />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));



