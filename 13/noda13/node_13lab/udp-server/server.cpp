#include <iostream>
#include "WinSock2.h"
#pragma comment(lib, "WS2_32.lib")
using namespace std;
#pragma warning(disable : 4996)

string GetErrorMsgText(int code);

string SetErrorMsgText(string msgText, int code)
{
    return msgText + GetErrorMsgText(code);
}

int main()
{
    WSADATA data;
    try
    {
        if (WSAStartup(MAKEWORD(2, 0), &data) != 0)
            throw SetErrorMsgText("startup:", WSAGetLastError());

        SOCKET sock;
        if ((sock = socket(AF_INET, SOCK_DGRAM, NULL)) == INVALID_SOCKET)
            throw SetErrorMsgText("crete socket:", WSAGetLastError());

        SOCKADDR_IN serv;

        serv.sin_family = AF_INET;
        serv.sin_port = htons(5000);
        serv.sin_addr.s_addr = INADDR_ANY;

        if ((bind(sock, (LPSOCKADDR)&serv, sizeof(serv))) == SOCKET_ERROR)
            throw SetErrorMsgText("binding socket:", WSAGetLastError());

        SOCKADDR_IN clnt;
        memset(&clnt, 0, sizeof(clnt));
        int lclnt = sizeof(clnt); // Размер sockaddr_in

        char ibuf[50];
        char obuf[50] = "ECHO: ";
        int libuf = 0, lobuf = 0;

        while (true)
        {
            if ((libuf = recvfrom(sock, ibuf, sizeof(ibuf), NULL,
                (sockaddr*)&clnt, &lclnt)) == SOCKET_ERROR)
                throw SetErrorMsgText("recvfrom:", WSAGetLastError());

            ibuf[libuf] = '\0';

            if (strcmp(ibuf, "") == 0)
                break;
            cout << "\n" << ibuf;
            strcpy(obuf, "ECHO: ");
            strcat(obuf, ibuf);

            if ((lobuf = sendto(sock, obuf, strlen(obuf) + 1, NULL,
                (sockaddr*)&clnt, sizeof(clnt))) == SOCKET_ERROR)
                throw SetErrorMsgText("send:", WSAGetLastError());
        }


        if (closesocket(sock) == SOCKET_ERROR)
            throw SetErrorMsgText("close server socket:", WSAGetLastError());

        if (WSACleanup() == SOCKET_ERROR)
            throw SetErrorMsgText("WSAcleanup:", WSAGetLastError());
    }
    catch (string errorMsg)
    {
        cout << endl << "WSALastError: " << errorMsg;
    }
}

string GetErrorMsgText(int code)
{
    string msgText;
    switch (code)
    {
    case WSAEINTR: msgText = "WSAEINTR"; break;
    case WSAEACCES: msgText = "WSAEACCES"; break;
    case WSASYSCALLFAILURE: msgText = "WSASYSCALLFAILURE"; break;
    default: msgText = "***ERROR***"; break;
    };
    return msgText;
};





