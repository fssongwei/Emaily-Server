This is the back-end of the [iShop](https://github.com/fssongwei/iShop-Client) app:

## 1. Authentication

####验证用户是否登录，并返回用户信息

Request

```http
GET /auth/user
```

Response

1. 用户登录成功，返回用户数据

   ```JSON
   {
     "avatar": "AVATAR_URL",
     "balance": 0,
     "_id": "USER_ID",
     "googleUserId": "USER_GOOGLE_ID",
     "name": "David Song",
   }
   ```

2. 用户未登录，返回 401 状态码

   ```json
   {
     "msg": "User is not login!"
   }
   ```

####退出登录状态

Request

```http
GET /auth/logout
```

Response

```json
{
  "msg": "Log out success!"
}
```

## 2. Product

#### 获取商品列表

Request

```http
GET /products
```

Response

```json
[
  {
    "pics": ["IMAGE_URL1", "IMAGE_URL2", "IMAGE_URL3"],
    "_id": "5f58f100d42e23b6acc74f72",
    "name": "iPad Pro",
    "intro": "This is a brand new ipad pro with a very cheap price.",
    "price": 20,
    "amount": 10,
    "owner": "5f5894ed201791a9fb4768f7"
  },
  {
    "pics": ["IMAGE_URL1", "IMAGE_URL2"],
    "_id": "5f58f117d42e23b6acc74f73",
    "name": "iPad Air",
    "intro": "This is a brand new ipad air with a very cheap price.",
    "price": 200,
    "amount": 10,
    "owner": "5f5894ed201791a9fb4768f7"
  }
]
```

#### 获取单个商品

Request

```http
GET /products/:id
```

Response

```json
{
  "pics": ["IMAGE_URL1", "IMAGE_URL2", "IMAGE_URL3"],
  "_id": "5f58f100d42e23b6acc74f72",
  "name": "iPad Pro",
  "intro": "This is a brand new ipad pro with a very cheap price.",
  "price": 20,
  "amount": 10,
  "owner": "5f5894ed201791a9fb4768f7"
}
```

#### 上传商品信息

Request

```http
POST /products
{
	name: "ITEM_NAME",
	intro: "ITEM_INTRODUCTION",
	price: "ITEM_PRICE",
	amount: "ITEM_AMOUNT",
	pics[1]: "IMAGE_URL1",
	pics[2]: "IMAGE_URL2"
}
```

Response

```json
{
  "msg": "Product created successfully!",
  "itemId": "5f58f2a98ae688b708af3666"
}
```

#### 更新商品信息

Request

```json
PUT /products/:id
{
	name: "ITEM_NAME",
	intro: "ITEM_INTRODUCTION",
	price: "ITEM_PRICE",
	amount: "ITEM_AMOUNT",
	pics[1]: "IMAGE_URL1",
	pics[2]: "IMAGE_URL2"
}
```

Response

```json
{
  "msg": "Product updated!"
}
```

#### 删除商品

Request

```http
DELETE /products/:id
```

Response

```json
{
  "msg": "Product removed!"
}
```
