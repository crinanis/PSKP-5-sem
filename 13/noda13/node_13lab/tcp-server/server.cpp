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
        if ((sock = socket(AF_INET, SOCK_STREAM, NULL)) == INVALID_SOCKET)
            throw SetErrorMsgText("crete socket:", WSAGetLastError());

        SOCKADDR_IN serv;

        serv.sin_family = AF_INET;
        serv.sin_port = htons(5000);
        serv.sin_addr.s_addr = INADDR_ANY;

        if ((bind(sock, (LPSOCKADDR)&serv, sizeof(serv))) == SOCKET_ERROR)
            throw SetErrorMsgText("binding socket:", WSAGetLastError());

        if (listen(sock, SOMAXCONN) == SOCKET_ERROR)
            throw SetErrorMsgText("listen socket:", WSAGetLastError());

        while (true)
        {
            SOCKET clientSock;
            SOCKADDR_IN clientSockAdr;
            memset(&clientSockAdr, 0, sizeof(clientSockAdr));
            int lclnt = sizeof(clientSockAdr); // Размер sockaddr_in

            if ((clientSock = accept(sock, (sockaddr*)&clientSockAdr, &lclnt)) == INVALID_SOCKET)
                throw SetErrorMsgText("Accept:", WSAGetLastError());

            cout << "\nconnected client info:" << inet_ntoa(clientSockAdr.sin_addr) << ":" << htons(clientSockAdr.sin_port);

            char ibuf[50];
            char echo[50] = "echo: ";
            int libuf = 0, lobuf = 0;

            while (true)
            {
                if ((libuf = recv(clientSock, ibuf, sizeof(ibuf), NULL)) == SOCKET_ERROR)
                    throw SetErrorMsgText("recv:", WSAGetLastError());

                ibuf[libuf] = '\0';

                if (strcmp(ibuf, "") == 0)
                    break;
                cout << "\nRecieved message:" << ibuf << endl;
                
                
                
                strcat(echo, ibuf);
                cout << echo << "\n";
                if ((lobuf = send(clientSock, echo, strlen(echo) + 1, NULL)) == SOCKET_ERROR)
                    throw SetErrorMsgText("send:", WSAGetLastError());
            }

            if (closesocket(clientSock) == SOCKET_ERROR)
                throw SetErrorMsgText("close client socket:", WSAGetLastError());

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



