import React, { useState } from 'react';
import Axios from 'axios';
import { Form, Input, Button } from 'antd';
import 'antd/dist/antd.css';
import * as ROUTES from '../../constants/routes';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },

  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
      offset: 0,
    },
  },
};

const EditNickname = (props) =>{
  const {authUser} = props;
  const [nickname, setNickname]= useState('');

  const onFinish = ()=>{
    onClickSubmitButton();
  }

  const getUserByNickname = ()=>{
    try{
      return Axios.get(`${process.env.REACT_APP_API_SERVER}/user/nickname?nickname=${nickname}`, {} );
    } catch (error){
      console.log(error);
    } 
  };

  const changeUserNickname = (nName) =>{
    Axios.put(`${process.env.REACT_APP_API_SERVER}/user/${authUser.email}?nickname=${nName}`, {}
    // JSON.stringify({
    // screenname: "abc",
    // nickname: "abc",
    // email: "abc@gmail.com"}), {headers:{
    //   "Content-Type": "application/json"
    // }}
  )
    .then(function (response) {
      console.log("axios post response:", response);
    }).catch(function (error) {
      console.log(error);
    });
  }

  async function onClickSubmitButton() {
    try {
      const userWithNickname = await getUserByNickname();
      console.log("what's in get axios nname:", userWithNickname);
      const existedNickname = userWithNickname.data.nickname;
      console.log("-----------------------:", existedNickname);
      if(existedNickname !== undefined){
        alert("A user with this nickname already exists, please input a different nickname.")
      }
      if(existedNickname === undefined){
        changeUserNickname(nickname);
        alert("Nickname updated successfully!")
        props.history.push(ROUTES.HOME);

      }
    } catch(error) {
      alert(error.message);
    }
  }

  if(authUser && authUser.emailVerified) {
    return(
      <div>
      <br />
        <Form
          onFinish={onFinish}
          {...formItemLayout}
          //form={form}
          name="Login"
        >
          <Form.Item
            name="nickname"
            label="Nickname"
            value={nickname}
          >
            <Input onChange={e => setNickname(e.target.value)} />
          </Form.Item>

          <Form.Item
            {...tailFormItemLayout}
            onSubmit={onClickSubmitButton}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>

        </Form>

    </div>
    )
  } else{
    props.history.push(ROUTES.SIGN_IN);
    return null;
  }

};

export default EditNickname;