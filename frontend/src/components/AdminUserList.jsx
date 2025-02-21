// AdminUserList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, message, Space } from 'antd';

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/users'); // GET /api/users
      setUsers(res.data);
    } catch (err) {
      message.error(err.response?.data?.message || '获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      await axios.post(`/api/users/${userId}/reset_password`); 
      message.success(`用户 ${userId} 密码已重置为 'xiaotu123'`);
    } catch (err) {
      message.error(err.response?.data?.message || '重置密码失败');
    }
  };

  const handleToggleAdmin = async (userId) => {
    try {
      const res = await axios.post(`/api/users/${userId}/toggle_admin`);
      message.success(res.data.message || '管理员权限已更新');
      // 更新本地数据
      setUsers((prev) => prev.map(u => {
        if (u.id === userId) {
          return { ...u, is_admin: res.data.is_admin };
        }
        return u;
      }));
    } catch (err) {
      message.error(err.response?.data?.message || '更新管理员权限失败');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 50 },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: 'B站UID', dataIndex: 'bilibili_uid', key: 'bilibili_uid' },
    {
      title: '是否管理员',
      dataIndex: 'is_admin',
      key: 'is_admin',
      render: (val) => val ? '是' : '否'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        const isAdmin = record.is_admin;
        return (
          <Space>
            <Button onClick={() => handleResetPassword(record.id)}>
              重置密码
            </Button>
            <Button onClick={() => handleToggleAdmin(record.id)}>
              {isAdmin ? '取消管理员' : '设为管理员'}
            </Button>
          </Space>
        );
      },
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>用户管理</h2>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={users}
      />
    </div>
  );
}

export default AdminUserList;
