# /routes
#### 모든 경로를 라우팅합니다.
<br>

# /logic
#### project, task 실제로 사용하는 로직을 모아둔 디렉토리 (service)
<br>

# /repository
#### 각각의 데이터를 저장하는 리스트를 가지고 있고

#### 리스트 내에서의 데이터 인덱스, 데이터를 찾는 findXXXX 함수를 만들어 편리하게 사용하고자 했습니다

<br>

---

####  POST project response

```json
{
    id: 1,
    title: "프로젝트"
} 
```
  

#### POST task response

```json
{
    pjId: 1,
    id: 1,
    title: "태스크"
} 
```

