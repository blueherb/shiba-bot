# shiba-bot

> 디스코드에서 활동하는 인디 팀을 위한 근태관리용 시바봇
<br>

## 왜 필요한가요

> 시바봇은 디스코드 채널의 활동 인원들이 얼마나 작업했는지 수동 측정합니다.
<br>

종종 디스코드에서 작은 인디 팀이 조직적으로 활동하곤 합니다.

팀원들이 스스로 작업 시간을 기록할 수 있는 가벼운 기능이 필요했습니다.
<br><br>

## 실행법

> ### Windows (Node.js 사전 설치 필요)
<br>

1. 다운로드 ▶ https://github.com/blueherb/shiba-bot/archive/refs/heads/main.zip <br><br>
2. 메인 폴더의 `.env.example`을 복사해 `.env`로 이름을 바꾼 뒤 아래 항목을 채워주세요<br><br>

```
DISCORD_TOKEN=자신의 디스코드 봇 토큰(절대 공개 금지)
CLIENT_ID=봇의 애플리케이션 ID
GUILD_ID=봇이 적용될 서버의 ID
```
3. `start.bat` 실행 <br><br>

> ### Linux (Docker 사전 설치 필요)
<br>

1. 다운로드
```bash
git clone https://github.com/blueherb/shiba-bot.git
cd shiba-bot
```
2. `.env.example`을 복사해 `.env`로 이름을 바꾼 뒤 수정
```bash
cp .env.example .env
nano .env
```
3. Docker 빌드 및 실행
```bash
docker compose up -d --build
```
<br><br>

## 무슨 기능이 있나요

시바봇은 아래의 기능을 가집니다.

- `/출근` : 출근 시간을 기록합니다.
- `/퇴근` : 퇴근 시간을 기록합니다.

- `/휴식 시작` : 근무 중 휴식 시작을 기록합니다.
- `/휴식 종료` : 근무 중 휴식 시간을 종료합니다.

- `/현황` : 현재 근무인원 현황을 확인합니다.
- `/기록 | 기간 | 유저` : 원하는 유저의 근무 기록을 열람합니다.

- 매일 `23:50` 퇴근 처리가 안 된 인원을 자동 퇴근시키고 DM으로 알립니다.
- 일일 할당량 달성 시 DM으로 알립니다.
<br><br>

## 설정

`data/config.json`에서 아래 항목을 수정할 수 있습니다. 파일이 없으면 자동 생성됩니다.

| 항목 | 기본값 | 설명 |
|------|--------|------|
| `dailyQuotaHours` | `5` | 일일 목표 근무 시간 (단위: 시간) |
| `autoClockOutTime` | `"23:50"` | 자동 퇴근 처리 시각 (HH:MM 형식) |
| `quotaNotified` | `true` | 할당량 달성 시 DM 알림 보내기 여부 |
```json
{
  "dailyQuotaHours": 5,
  "autoClockOutTime": "23:50",
  "quotaNotified": true  
}
```
