import { http, HttpResponse } from "msw";

export const handlers = [
  // 회원가입
  http.post("/api/v1/auth/signup", async ({ request }) => {
    const body = (await request.json()) as {
      name: string;
      email: string;
      password: string;
    };

    // 유효성 검사
    if (!body.name || !body.email || !body.password) {
      return HttpResponse.json(
        { error: "모든 필드를 입력해주세요." },
        { status: 400 }
      );
    }

    if (body.password.length < 4) {
      return HttpResponse.json(
        { error: "비밀번호는 4자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    // 성공 응답
    return HttpResponse.json(
      {
        name: body.name,
        email: body.email,
        password: body.password,
      },
      { status: 201 }
    );
  }),

  // 로그인
  http.post("/api/v1/auth/login", async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
      password: string;
    };

    // 유효성 검사
    if (!body.email || !body.password) {
      return HttpResponse.json(
        { error: "이메일과 비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    // 기본 관리자 계정 확인
    if (body.email === "admin" && body.password === "admin123") {
      return HttpResponse.json(
        {
          "Access Token": "",
        },
        { status: 200 }
      );
    }

    // 실제로는 서버에서 사용자 확인을 해야 하지만, 여기서는 간단히 처리
    // LocalStorage에 저장된 사용자 정보를 확인하는 것은 클라이언트 측에서 처리
    // 여기서는 항상 성공으로 처리 (실제 구현에서는 서버에서 검증)
    return HttpResponse.json(
      {
        "Access Token": "",
      },
      { status: 200 }
    );
  }),
];

