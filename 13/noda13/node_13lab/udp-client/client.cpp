#include <iostream>
#include <string>
#include <regex>
#include <chrono>
#include "WinSock2.h"
#include "windows.h"
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

        cout << "startup\n";

        SOCKET sock;
        if ((sock = socket(AF_INET, SOCK_DGRAM, NULL)) == INVALID_SOCKET)
            throw SetErrorMsgText("crete socket:", WSAGetLastError());

        cout << "create socket\n";

        SOCKADDR_IN serv;

        serv.sin_family = AF_INET;
        serv.sin_port = htons(5000);
        serv.sin_addr.s_addr = inet_addr("127.0.0.1");

        //char* ibuf = new char[] {"Hello form client: "};
        char* ibuf = new char[] {"Ohio"};
        char obuf[50];
        int send_i = 0, recv_i = 0;

        string number = "";

        int counter = 0, maxCounter = 1;
        regex numberReg("\d");
        while (counter < maxCounter)
        {

            if ((send_i = sendto(sock, ibuf, strlen(ibuf) + 1, NULL,
                (sockaddr*)&serv, sizeof(serv))) == SOCKET_ERROR)
                throw SetErrorMsgText("send:", WSAGetLastError());

            int ln = sizeof(serv);

            if ((recv_i = recvfrom(sock, obuf, sizeof(obuf), NULL,
                (sockaddr*)&serv, &ln)) == SOCKET_ERROR)
                throw SetErrorMsgText("recv:", WSAGetLastError());

            cout << "received data: " << obuf << "\n";
            counter++;
        }
        if (closesocket(sock) == SOCKET_ERROR)
            throw SetErrorMsgText("close socket:", WSAGetLastError());

        cout << "close socket\n";

        if (WSACleanup() == SOCKET_ERROR)
            throw SetErrorMsgText("WSAcleanup:", WSAGetLastError());

        cout << "cleanup\n";
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

