#include <iostream>
#include <string>
#include <tchar.h>
#include <ctime>
#include "Winsock2.h" // ��������� WS2_32.dll
#pragma comment(lib, "WS2_32.lib") // ������� WS2_32.dll
#pragma warning(disable : 4996)

using namespace std;
string GetErrorMsgText(int code) // c����������� ����� ������
{
	string msgText;
	switch (code) // �������� ���� ��������
	{
	case WSAEINTR: msgText = "WSAEINTR"; break;
	case WSAEACCES: msgText = "WSAEACCES"; break;
	case WSAEFAULT: msgText = "WSAEFAULT"; break;
	case WSAEINVAL: msgText = "WSAEINVAL"; break;
	case WSAEMFILE: msgText = "WSAEMFILE"; break;
	case WSAEWOULDBLOCK: msgText = "WSAEWOULDBLOCK"; break;
	case WSAEINPROGRESS: msgText = "WSAEINPROGRESS"; break;
	case WSAEALREADY: msgText = "WSAEALREADY"; break;
	case WSAENOTSOCK: msgText = "WSAENOTSOCK"; break;
	case WSAEDESTADDRREQ: msgText = "WSAEDESTADDRREQ"; break;
	case WSAEMSGSIZE: msgText = "WSAEMSGSIZE"; break;
	case WSAEPROTOTYPE: msgText = "WSAEPROTOTYPE"; break;
	case WSAENOPROTOOPT: msgText = "WSAENOPROTOOPT"; break;
	case WSAEPROTONOSUPPORT: msgText = "WSAEPROTONOSUPPORT"; break;
	case WSAESOCKTNOSUPPORT: msgText = "WSAESOCKTNOSUPPORT"; break;
	case WSAEOPNOTSUPP: msgText = "WSAEOPNOTSUPP"; break;
	case WSAEPFNOSUPPORT: msgText = "WSAEPFNOSUPPORT"; break;
	case WSAEAFNOSUPPORT: msgText = "WSAEAFNOSUPPORT"; break;
	case WSAEADDRINUSE: msgText = "WSAEADDRINUSE"; break;
	case WSAEADDRNOTAVAIL: msgText = "WSAEADDRNOTAVAIL"; break;
	case WSAENETDOWN: msgText = "WSAENETDOWN"; break;
	case WSAENETUNREACH: msgText = "WSAENETUNREACH"; break;
	case WSAENETRESET: msgText = "WSAENETRESET"; break;
	case WSAECONNABORTED: msgText = "WSAECONNABORTED"; break;
	case WSAECONNRESET: msgText = "WSAECONNRESET"; break;
	case WSAENOBUFS: msgText = "WSAENOBUFS"; break;
	case WSAEISCONN: msgText = "WSAEISCONN"; break;
	case WSAENOTCONN: msgText = "WSAENOTCONN"; break;
	case WSAESHUTDOWN: msgText = "WSAESHUTDOWN"; break;
	case WSAETIMEDOUT: msgText = "WSAETIMEDOUT"; break;
	case WSAECONNREFUSED: msgText = "WSAECONNREFUSED"; break;
	case WSAEHOSTDOWN: msgText = "WSAEHOSTDOWN"; break;
	case WSAEHOSTUNREACH: msgText = "WSAEHOSTUNREACH"; break;
	case WSAEPROCLIM: msgText = "WSAEPROCLIM"; break;
	case WSASYSNOTREADY: msgText = "WSASYSNOTREADY"; break;
	case WSAVERNOTSUPPORTED: msgText = "WSAVERNOTSUPPORTED"; break;
	case WSANOTINITIALISED: msgText = "WSANOTINITIALISED"; break;
	case WSAEDISCON: msgText = "WSAEDISCON"; break;
	case WSATYPE_NOT_FOUND: msgText = "WSATYPE_NOT_FOUND"; break;
	case WSAHOST_NOT_FOUND: msgText = "WSAHOST_NOT_FOUND"; break;
	case WSATRY_AGAIN: msgText = "WSATRY_AGAIN"; break;
	case WSANO_RECOVERY: msgText = "WSANO_RECOVERY"; break;
	case WSANO_DATA: msgText = "WSANO_DATA"; break;
	case WSA_INVALID_HANDLE: msgText = "WSA_INVALID_HANDLE"; break;
	case WSA_INVALID_PARAMETER: msgText = "WSA_INVALID_PARAMETER"; break;
	case WSA_IO_INCOMPLETE: msgText = "WSA_IO_INCOMPLETE"; break;
	case WSA_IO_PENDING: msgText = "WSA_IO_PENDING"; break;
	case WSA_NOT_ENOUGH_MEMORY: msgText = "WSA_NOT_ENOUGH_MEMORY"; break;
	case WSA_OPERATION_ABORTED: msgText = "WSA_OPERATION_ABORTED"; break;
		//..........���� WSAGetLastError ..........................
	case WSASYSCALLFAILURE: msgText = "WSASYSCALLFAILURE"; break;
	default: msgText = "***ERROR***"; break;
	};
	return msgText;
};
string SetErrorMsgText(string msgText, int code)
{
	return msgText + GetErrorMsgText(code);
};
int _tmain(int argc, _TCHAR* argv[])
{
	SOCKET cC;
	WSADATA wsaData;
	try
	{
		if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0)
			throw SetErrorMsgText("Startup:", WSAGetLastError());

		if ((cC = socket(AF_INET, SOCK_STREAM, NULL)) == INVALID_SOCKET)
			throw SetErrorMsgText("socket:", WSAGetLastError());

		SOCKADDR_IN serv;
		serv.sin_family = AF_INET;
		serv.sin_port = htons(5000);
		serv.sin_addr.s_addr = inet_addr("127.0.0.1");

		if ((connect(cC, (sockaddr*)&serv, sizeof(serv))) == SOCKET_ERROR)
			throw SetErrorMsgText("connect:", WSAGetLastError());

		int lobuf = 0; //���������� ������������
		clock_t x = clock();
		char obuf[256] = "Hello!!";
		int libuf = 0;
		char ibuf[256] = "";

		if ((lobuf = send(cC, obuf, strlen(obuf) + 1, NULL)) == SOCKET_ERROR) {
			throw SetErrorMsgText("send:", WSAGetLastError());
		}

		if ((libuf = recv(cC, ibuf, sizeof(ibuf), NULL)) == SOCKET_ERROR)
			throw SetErrorMsgText("recv:", WSAGetLastError());
		cout << ibuf << endl;

		if (closesocket(cC) == SOCKET_ERROR)
			throw SetErrorMsgText("closesocket:", WSAGetLastError());

		if (WSACleanup() == SOCKET_ERROR)
			throw SetErrorMsgText("Cleanup:", WSAGetLastError());
	}
	catch (string errorMsgText)
	{
		cout << endl << errorMsgText;
	}
	system("pause");
	return 0;
}