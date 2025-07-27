import useSWR from "swr"
import { companyService, type Company } from "@/services/companyService"
import { has } from "lodash"

export function useCompany() {
    const {
        data: company,
        error,
        isLoading,
        mutate,
    } = useSWR<Company>("/api/company/my-company", companyService.getMyCompany, {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        errorRetryCount: 3,
        errorRetryInterval: 1000,
    })

    return {
        company,
        isLoading,
        isError: error,
        mutate,
        hasCompany: !!company,
    }
}

export function useCompanyById(id: string) {
    const {
        data: company,
        error,
        isLoading,
    } = useSWR<Company>(id ? `/api/company/my-company?userId=${id}` : null, () => companyService.getCompanyById(id), {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
    })

    return {
        company,
        isLoading,
        isError: error,
        hasCompany: !!company
    }
}
