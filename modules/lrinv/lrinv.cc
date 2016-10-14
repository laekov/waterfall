///under GPLV3 by LuRui
#include<cstdio>
#include<iostream>
#include<cmath>
#include<algorithm>
#include<cstring>
#define MAXN 200
using namespace std;
struct frac
{
    int up, down;
    frac operator = (frac x)
    {
        up = x.up;
        down = x.down;
    };
};
int gcd(int a,int b)
{
    return (b == 0) ? a : gcd(b,a % b);
}
frac operator + (frac a, frac b)
{
    int newup, newdown;
    newup = a.up * b.down + b.up * a.down;
    newdown = a.down * b.down;
    int r = abs(gcd(newup, newdown));
    frac ans;
    ans.up = newup / r;
    ans.down = newdown / r;
    return ans;
}
frac operator - (frac a, frac b)
{
    int newup, newdown;
    newup = a.up * b.down - b.up * a.down;
    newdown = a.down * b.down;
    int r = abs(gcd(newup, newdown));
    frac ans;
    ans.up = newup / r;
    ans.down = newdown / r;
    return ans;
}
frac operator * (frac a, frac b)
{
    int newup, newdown;
    newup = a.up * b.up;
    newdown = a.down * b.down;
    int r = abs(gcd(newup, newdown));
    frac ans;
    ans.up = newup / r;
    ans.down = newdown / r;
    return ans;
}
frac operator / (frac a, frac b)
{
    int newup, newdown;
    newup = a.up * b.down;
    newdown = a.down * b.up;
    int r = abs(gcd(newup, newdown));
    frac ans;
    ans.up = newup / r;
    ans.down = newdown / r;
    if(ans.down < 0)
    {ans.up *= -1; ans.down *= -1;}
    return ans;
}
void frprint(frac x)
{
    if(x.down != 1&&x.up != 0)
        cout << x.up << "/" << x.down;
    else
        cout << x.up;
}
frac coef[MAXN][MAXN];
int n;
    void permutation(int i, int j)
    {
        for(int t = 0;t < 2 * n; ++t)
        { int tmp;
            tmp = coef[i][t].up; coef[i][t].up = coef[j][t].up; coef[j][t].up = tmp;
            tmp = coef[i][t].down; coef[i][t].down = coef[j][t].down; coef[j][t].down = tmp;
        }
    }
    bool Gauss_elimination()
    {
        int i, j;
        bool flag = true;
        for(i = 0; i < n - 1; ++i)
        if(flag)
        {
            //cout << "safe1" << endl;
            if((coef[i][i].up) == 0)
            {
                //cout << "safe2" << endl;
                flag = false;
                for(j = i + 1; j < n; ++j)
                if(coef[j][i].up != 0)
                {
                    permutation(i, j);
                    flag = true;
                    break;
                }
            }
            //cout << "safe";
            if(flag)
                for(j = i + 1; j < n; ++j)
                {
                    frac l = coef[j][i] / coef[i][i];
                    //frprint(l); cout<<endl;
                    for(int t = 0; t < 2 * n; ++t)
                    {
                        coef[j][t] = coef[j][t] - (l * coef[i][t]);
                    }
                    //cout << "safe2" << endl;
                }
        }
        flag = (coef[n-1][n-1].up != 0);
        //cout << "no problem"<< endl;
        return flag;
    }
    void back_substitude()
    {
        int i, j, k;
        /*for(i = 0; i < n; ++i)
        {
            for(j = 0; j < 2 * n; ++j)
                cout << coef[i][j] << "\t";
            cout << endl;
        }*/
        for(i = n - 1; i >= 1; --i) ///做到第i个主元
            for(j = 0; j < i; ++j)  ///消元第j行
            {
                frac l = coef[j][i] / coef[i][i];
                for(k = i; k < 2 * n; k++)
                    coef[j][k] = coef[j][k] - (l * coef[i][k]);
            }
        for(i = 0; i < n; ++i)
        {
            frac l = coef[i][i];
            for(k = n;k < 2 * n;++k)
                coef[i][k] = coef[i][k] / l;
        }
    }
int main()
{
    cin >> n;
    for(int i = 0; i < n; i++)
        for(int j = 0; j < n; j++)
        {
            cin >> coef[i][j].up;
            coef[i][j].down = 1;
            coef[i][n+j].down = 1;
            coef[i][n+j].up = (i ==j) ? 1 : 0;
        }
    /*for(int i = 0;i < n; i++)
        {
            for(int j = 0; j < 2 * n; j++)
            {
                frprint(coef[i][j]);
                cout << "\t";
            }
            cout << "\n";
        }*/
    if(Gauss_elimination())
    {
        back_substitude();
        for(int i = 0;i < n; i++)
        {
            for(int j = 0; j < n; j++)
            {
                frprint(coef[i][j + n]);
                cout << "\t";
            }
			if (i + 1 < n) 
			{
				cout << "\n";
			}
        }
    }
    else
    cout << "The matrix is not invertible." << endl;
    return 0;
}
