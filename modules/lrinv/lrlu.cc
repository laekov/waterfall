///under GPLV3 LuRui
//modified by laekov
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
		printf("%3d/%-3d", x.up, x.down);
    else
		printf("   %-4d", x.up);
	putchar(32);
}
frac coef[MAXN][MAXN];
int n, no[MAXN], no1[MAXN];
    void permutation(int i, int j)
    {
        for(int t = 0;t < n; ++t)
        {
            int tmp;
            tmp = coef[i][t].up; coef[i][t].up = coef[j][t].up; coef[j][t].up = tmp;
            tmp = coef[i][t].down; coef[i][t].down = coef[j][t].down; coef[j][t].down = tmp;
        }
        int ttmp;
        ttmp = no[i];
        no[i] = no[j];
        no[j] = ttmp;
    }
    bool Gauss_elimination()
    {
        int i, j;
        bool flag = true;
        for(i = 0; i < n - 1; ++i)
        if(flag)
        {
            //cout << "safe" << i << endl;
            if((coef[i][i].up) == 0)
            {
                //cout << "safe2" << endl;
                flag = false; // cout << "change" << endl;
                for(j = i + 1; j < n; ++j)
                if(coef[j][i].up != 0)
                {
                //    cout << "change" << i << " " << j << endl;
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
                    coef[j][i] = l;
                    //frprint(l); cout<<endl;
                    for(int t = i + 1; t < n; ++t)
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
int main()
{
    cin >> n;
    frac zero, one;
    zero.up = 0; zero.down = 1;
    one.up = 1; one.down = 1;
    for(int i = 0; i < n; i++)
        for(int j = 0; j < n; j++)
        {
            char s[100];
            scanf("%s",&s);
            sscanf(s,"%d",&coef[i][j].up);
            if(strchr(s,'/'))
                sscanf(strchr(s,'/')+1,"%d",&coef[i][j].down);
            else
                coef[i][j].down = 1;
            coef[i][n+j].down = 1;
            coef[i][n+j].up = (i == j) ? 1 : 0;
            no[i] = i; no1[i] = i;
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
        cout << "The Lower Maxtrix L is:" << endl;
        for(int i = 0;i < n; i++)
        {
            for(int j = 0; j < n; j++)
            {
                if(i > j)
                frprint(coef[i][j]);
                else
                if(i == j)
                frprint(one);
                else
                frprint(zero);
                cout << "\t";
            }
            cout << "\n";
        }
        cout << "The Upper Maxtrix U is:" << endl;
        for(int i = 0;i < n; i++)
        {
            for(int j = 0; j < n; j++)
            {
                if(i <= j)
                frprint(coef[i][j]);
                else
                frprint(zero);
                cout << "\t";
            }
            cout << "\n";
        }
        bool ff = false;
        for(int i = 0; i < n; i++)
            if(i != no[i])
            ff = true;
        if(!ff) cout << "&The P is the identity maxtrix";
        else
        {
           cout << "PA=LU,the P is:" << endl;
           for(int i = 0; i < n; ++i)
            {
                for(int j = 0; j < n; ++j)
                {
                    if(no[i] == j)
                        frprint(one);
                    else frprint(zero);
                    cout << " ";
                }
				if (i + 1 < n) 
				{
					cout << "\n";
				}
            }
        }
    }
    else
    cout << "The matrix is not invertible." << endl;
    return 0;
}
