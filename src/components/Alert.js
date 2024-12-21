import React from 'react';

function Alert(props) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1050,
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        border: '2px solid white',
        color:'white'
      }}
    >
      {props.alert && (
        <div
          className={`alert alert-${props.alert.type} alert-dismissible fade show`}
          id="alert"
          role="alert"
          style={{
            width: '90%',
            borderRadius: '5px',
          }}
        >
          {props.alert.msg}
        </div>
      )}
    </div>
  );
}

export default Alert;