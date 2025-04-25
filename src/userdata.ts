export interface UserInfo {
    login: string;
    email: string;
    attrs: Record<string, any>;
    auditRatio: number;
    totalUp: number;
    totalDown: number;
    campus: string;
}


export interface UserData {
    userInfo: UserInfo;
    xpSum: number;
    level: number;
    projects: Array<{
        id: string;
        object: {
            name: string;
        };
        amount: number;
        createdAt: string;
    }>;
    allXp: Array<{
        id: string;
        object: {
            name: string;
            type: string;
        };
        amount: number;
        createdAt: string;
    }>;
    skills: Array<{
        amount: number;
        type: string;
    }>;
}

export interface GraphQLResponse {
    data: {
        user: UserInfo[];
        transaction_aggregate: {
            aggregate: {
                sum: {
                    amount: number;
                }
            }
        };
        level: Array<{amount: number}>;
        projects: Array<{
            id: string;
            object: {
                name: string;
            };
            amount: number;
            createdAt: string;
        }>;
        allXp: Array<{
            id: string;
            object: {
                name: string;
                type: string;
            };
            amount: number;
            createdAt: string;
        }>;
        skills: Array<{
            amount: number;
            type: string;
        }>;
    }
}



export interface SkillPoint {
    x: number;
    y: number;
    skill: string;
    value: number;
}

export interface Skills {
    [key: string]: number;
}


async function fetchUserData(): Promise<UserData> {
    const token: string | null = localStorage.getItem('token');
    const response: Response = await fetch('https://learn.reboot01.com/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
                query {
                    user {
                        login
                        email
                        attrs
                        auditRatio
                        totalUp
                        totalDown
                        campus
                    }
                    transaction_aggregate(
                        where: {
                            event: { path: { _eq: "/bahrain/bh-module" } },
                            type: { _eq: "xp" }
                        }
                    ) {
                        aggregate {
                            sum {
                                amount
                            }
                        }
                    }
                    level: transaction(
                        order_by: { amount: desc },
                        limit: 1,
                        where: {
                            type: { _eq: "level" },
                            path: { _like: "/bahrain/bh-module%" }
                        }
                    ) {
                        amount
                    }
                    projects: transaction(
                        where: {
                            type: { _eq: "xp" },
                            object: { type: { _eq: "project" } }
                        },
                        order_by: { createdAt: asc }
                    ) {
                        id
                        object {
                            name
                        }
                        amount
                        createdAt
                    }
                    allXp: transaction(
                        where: {
                            event: { path: { _eq: "/bahrain/bh-module" } },
                            type: { _eq: "xp" }
                        },
                        order_by: { createdAt: asc }
                    ) {
                        id
                        object {
                            name
                            type
                        }
                        amount
                        createdAt
                    }
                    skills: transaction(
                        where: {
                            _and: [
                                {type: { _iregex: "(^|[^[:alnum:]])[[:alnum:]]*skill[[:alnum:]]*($|[^[:alnum:]])" }},
                                {type: {_like: "%skill%"}},
                                {object: {type: {_eq: "project"}}},
                                {type: {_in: [
                                    "skill_prog", "skill_algo", "skill_sys-admin", "skill_front-end", 
                                    "skill_back-end", "skill_stats", "skill_ai", "skill_game", 
                                    "skill_tcp"
                                ]}}
                            ]
                        }
                        order_by: [{type: asc}, {createdAt: desc}]
                        distinct_on: type
                    ) {
                        amount
                        type
                    }
                }
            `        })
    });

    const data: GraphQLResponse = await response.json();

    return {
        userInfo: data.data.user[0],
        xpSum: data.data.transaction_aggregate.aggregate.sum.amount,
        level: data.data.level[0]?.amount || 0,
        projects: data.data.projects,
        allXp: data.data.allXp,
        skills: data.data.skills
    };
}


export { fetchUserData };
