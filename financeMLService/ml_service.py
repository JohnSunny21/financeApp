import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from kneed import KneeLocator
import numpy as np


def analyze_spending_patterns(transaction_data: list) -> dict:
    """
    Analyzes a list of transaction data to find spending clusters using K-Means.

    Args:
        transaction_data: A list of transaction dictionaries.

    Returns:
        A dictionary containing the analysis message and a list of insights.
    """



    # 1. Load and filter expense data
    df = pd.DataFrame(transaction_data)
    df_expenses = df.loc[df['type'].str.upper() == "EXPENSE"].copy()

    if len(df_expenses) < 2:
        return {"insights":[],
                "message": "Not enough expense data to perform analysis."}
    

    # 2. Feature Engineering & Scaling
    # Create a list of columns to drop, ignoring errors if a column doesn't exist
    cols_to_drop = ['description','type','date','id','createdAt','user']
    features = pd.get_dummies(df_expenses.drop(columns=cols_to_drop, errors='ignore'))

    # Ensure there are features to scale
    if features.empty:
        return {"insights":[],
                "message":"No features available for clustering after processing."}
    
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(features)

    # 3. Elbow method to find Optimal K
    max_k = min(7, len(df_expenses) - 1)
    if max_k < 2:
        return {"insights":[],
                "message":"Not enough diverse data to form meaningful clusters."}
    
    k_range = range(1, max_k + 1)
    inertia_scores = []
    for k in k_range:
        kmeans = KMeans(n_clusters=k, random_state=42, n_init='auto')
        kmeans.fit(scaled_features)
        inertia_scores.append(kmeans.inertia_)

    kl = KneeLocator(k_range, inertia_scores, curve='convex', direction='decreasing')
    optimal_k = kl.elbow if kl.elbow else 3

    # 4. Final Clustering

    final_kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init='auto')
    df_expenses['cluster'] = final_kmeans.fit_predict(scaled_features)


    # 5. Cluster Interpretation
    cluster_insights = []

    for i in range(final_kmeans.n_clusters):
        cluster_df = df_expenses[df_expenses['cluster'] == i]

        if cluster_df.empty:
            continue

        transaction_count = len(cluster_df)
        average_amount = cluster_df['amount'].mean()
        most_common_category = cluster_df['category'].mode()[0]

        # Simple heuristic for naming

        cluster_name = f"Spending Group {i + 1}"
        if average_amount > 1000:
            cluster_name = "Major Bills & Payments"
        elif average_amount > 200: # Covers range (200, 100)
            cluster_name = " Medium-Sized Spending"
        elif transaction_count >= 5 and average_amount < 100:
            cluster_name = "Frequent Small, Daily Expenses"
        elif transaction_count > 2:
            cluster_name = "Regular Monthly Costs"

        insight = {
            "clusterName": cluster_name,
            "transactionCount": int(transaction_count),
            "averageAmount": round(average_amount, 2),
            "dominantCategory": most_common_category,
            "transactions":cluster_df[['description','amount','date','category']].to_dict('records')
        }
        cluster_insights.append(insight)


        # This is the final object that will be returned to the controller
    return {
        "message": f"Successfully analyzed spending into {optimal_k} clusters.",
        "insights":cluster_insights
    }