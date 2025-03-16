# 兔福音乐清单 Docker 部署指南

本指南将帮助您使用 Docker 部署兔福音乐清单应用。

## 前提条件

- 安装 [Docker](https://docs.docker.com/get-docker/)
- 安装 [Docker Compose](https://docs.docker.com/compose/install/)

## 部署步骤

### 1. 准备环境

确保您已经克隆了项目代码库：

```bash
git clone <项目仓库URL>
cd tofu-music-list
```

### 2. 配置环境变量

复制后端的环境变量示例文件并根据需要修改：

```bash
cp backend/.env.example backend/.env
```

编辑 `.env` 文件，设置必要的环境变量。

### 3. 使用 Docker Compose 构建和启动应用

```bash
# 构建并启动容器
docker-compose up -d

# 查看日志
docker-compose logs -f
```

应用将在 http://localhost:5000 上运行。

### 4. 初始化数据库（首次运行）

```bash
# 进入容器
docker-compose exec tofu-music-app bash

# 初始化数据库
python main.py --init-db

# 退出容器
exit
```

## 常用操作

### 停止应用

```bash
docker-compose down
```

### 重新构建应用

如果您修改了代码，需要重新构建：

```bash
docker-compose build
docker-compose up -d
```

### 查看容器状态

```bash
docker-compose ps
```

### 查看应用日志

```bash
docker-compose logs -f
```

## 数据持久化

应用的数据存储在以下位置：

- 数据库文件: `./backend/songs.db`
- 上传文件: `./backend/uploads/`

这些目录已经通过 Docker 卷映射到容器内部，确保数据持久化。

## 使用 PostgreSQL（可选）

如果您想使用 PostgreSQL 替代 SQLite，请编辑 `docker-compose.yml` 文件，取消 PostgreSQL 服务的注释，并确保在 `.env` 文件中设置正确的数据库连接 URL。

## 生产环境部署注意事项

1. 在生产环境中，建议配置 HTTPS。可以使用 Nginx 作为反向代理并配置 SSL 证书。
2. 确保设置安全的密码和密钥。
3. 定期备份数据库和上传文件。
4. 考虑使用 Docker Swarm 或 Kubernetes 进行更复杂的部署和扩展。

## 故障排除

### 应用无法启动

检查日志以获取详细错误信息：

```bash
docker-compose logs
```

### 数据库连接问题

确保环境变量中的数据库连接信息正确。如果使用 PostgreSQL，确保数据库服务已启动并可访问。

### 前端无法连接到后端 API

检查前端代码中的 API 基础 URL 配置，确保它指向正确的后端地址。 