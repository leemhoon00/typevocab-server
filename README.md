## Typevocab을 쓰는 이유가 뭔가요??
제가 토익사관학교에 있을 때 느낀건데 대부분 사람들이 단어를 외울 때 노트에 직접 써가면서 외우더라구요.

근데 저는 한 10분 쓰고 나니까 손도 아프고 시간도 너무 오래 걸려서 엑셀에 키보드로 타이핑하며 외웠어요.

그렇게 외우다 보니 노트에 써서 외우는 것 보단 개인적으로 좋았지만 불편한 부분들이 많아서 제가 쓰려고 직접 만들었습니다!

## 어떤 부분이 불편했나요??
우선 첫 번째로 영단어의 발음을 듣기 위해선 추가적인 노력이 필요했어요. 이왕 단어를 외우는 거 발음까지 들려주면 좋겠다고 생각했어요.

두 번째로 제가 만든 단어, 단어장들을 엑셀에서 관리/사용하기가 불편했어요. 그래서 손쉽게 단어장을 삭제하거나 추가할 수 있도록 만들었어요.

그렇게 제가 만든 단어장들을 토대로 문제지를 만들어서 풀고 싶은데 그것 마저도 키보드로 하고 싶었어요. 만드는 김에 pdf 파일로 다운받을 수 있게 했어요.

<br>

## 1. Output
- [시연영상 (youtube)](https://typevocab.leemhoon00.com)
- [프론트 소스코드](https://github.com/leemhoon00/typevocab-client)
- 개발 기간: 23.08.22 ~ 23.10.07


## 2. Architecture
![architecture](https://github.com/leemhoon00/typevocab-server/assets/57895643/42ae3c12-4ab3-49d0-b625-d7ca11db7861)


## 3. 인증 Sequence
![vocab-auth-sequence](https://github.com/leemhoon00/typevocab-server/assets/57895643/ea3c90e5-4031-4114-8adc-987900cce445)

<br>

## 4. 테스트 코드
![image](https://github.com/leemhoon00/typevocab-server/assets/57895643/61d36fc8-2ced-4a90-ae1d-6f5a321e196c)

> 의미 없는 테스트 다 빼고 제가 생각했을 때 의미 있는 테스트만 진행했습니다!

<br>

## 5. Swagger
|Apis|Detail|
|----|-----|
|![image](https://github.com/leemhoon00/typevocab-server/assets/57895643/c8e3375d-b67d-4976-9a4e-862c250d31e1)| ![image](https://github.com/leemhoon00/typevocab-server/assets/57895643/a31b1ce3-e4cf-407f-bfcb-25689db1c6a1)|

|Schemas|
|---|
|![image](https://github.com/leemhoon00/typevocab-server/assets/57895643/83cc2c45-1b73-47f1-8c79-2f3e84689170)|

