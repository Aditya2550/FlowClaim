$ErrorActionPreference = 'Stop'
$base = 'http://localhost:3000/api'
$healthUrl = 'http://localhost:3000/health'
$startedServer = $null

function To-JsonBody($obj) {
    return ($obj | ConvertTo-Json -Depth 20)
}

try {
    $health = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 2
}
catch {
    $startedServer = Start-Process -FilePath 'node' -ArgumentList 'src/server.js' -WorkingDirectory (Get-Location).Path -PassThru
    Start-Sleep -Seconds 2
    $health = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 8
}

try {
    if ($health.StatusCode -ne 200) {
        throw 'Backend health check failed before smoke tests.'
    }

    $empLogin = Invoke-RestMethod -Method Post -Uri "$base/auth/login" -ContentType 'application/json' -Body (To-JsonBody @{ email = 'employee1@acme.com'; password = 'Demo@123' })
    $mgrLogin = Invoke-RestMethod -Method Post -Uri "$base/auth/login" -ContentType 'application/json' -Body (To-JsonBody @{ email = 'manager1@acme.com'; password = 'Demo@123' })
    $adminLogin = Invoke-RestMethod -Method Post -Uri "$base/auth/login" -ContentType 'application/json' -Body (To-JsonBody @{ email = 'admin@acme.com'; password = 'Demo@123' })

    $empToken = $empLogin.token
    $mgrToken = $mgrLogin.token
    $adminToken = $adminLogin.token

    $created = Invoke-RestMethod -Method Post -Uri "$base/expenses" -ContentType 'application/json' -Headers @{ Authorization = "Bearer $empToken" } -Body (To-JsonBody @{ amount = 123.45; currency = 'USD'; category = 'Travel'; vendor = 'Uber'; description = 'Airport transfer'; receipt_url = 'https://example.com/r1.jpg' })
    $expenseId = $created.data.id

    $empList = Invoke-RestMethod -Method Get -Uri "$base/expenses" -Headers @{ Authorization = "Bearer $empToken" }
    $mgrPending = Invoke-RestMethod -Method Get -Uri "$base/expenses/pending" -Headers @{ Authorization = "Bearer $mgrToken" }

    $approved = Invoke-RestMethod -Method Patch -Uri "$base/expenses/$expenseId/approve" -ContentType 'application/json' -Headers @{ Authorization = "Bearer $mgrToken" } -Body (To-JsonBody @{ comment = 'Looks good' })
    $finalState = $approved
    for ($i = 0; $i -lt 5; $i++) {
        if ($finalState.data.status -ne 'pending') { break }
        try {
            $finalState = Invoke-RestMethod -Method Patch -Uri "$base/expenses/$expenseId/approve" -ContentType 'application/json' -Headers @{ Authorization = "Bearer $adminToken" } -Body (To-JsonBody @{ comment = 'Admin step' })
        }
        catch {
            break
        }
    }

    $created2 = Invoke-RestMethod -Method Post -Uri "$base/expenses" -ContentType 'application/json' -Headers @{ Authorization = "Bearer $empToken" } -Body (To-JsonBody @{ amount = 50; currency = 'USD'; category = 'Food'; vendor = 'Cafe'; description = 'Team lunch'; receipt_url = 'https://example.com/r2.jpg' })
    $expenseId2 = $created2.data.id
    $rejected = Invoke-RestMethod -Method Patch -Uri "$base/expenses/$expenseId2/reject" -ContentType 'application/json' -Headers @{ Authorization = "Bearer $mgrToken" } -Body (To-JsonBody @{ comment = 'Policy violation' })

    $result = [ordered]@{
        login_employee               = [ordered]@{ success = [bool]$empLogin.token; role = $empLogin.user.role }
        login_manager                = [ordered]@{ success = [bool]$mgrLogin.token; role = $mgrLogin.user.role }
        login_admin                  = [ordered]@{ success = [bool]$adminLogin.token; role = $adminLogin.user.role }
        create_expense               = [ordered]@{ success = $created.success; expense_id = $expenseId; status = $created.data.status; steps = $created.data.approval_steps.Count }
        list_expenses_employee_count = $empList.data.Count
        pending_for_manager_count    = $mgrPending.data.Count
        approve_first_step           = [ordered]@{ success = $approved.success; status_after = $approved.data.status }
        final_status_after_admin     = $finalState.data.status
        reject_second_expense        = [ordered]@{ success = $rejected.success; expense_id = $expenseId2; status_after = $rejected.data.status }
    }

    $result | ConvertTo-Json -Depth 10
}
finally {
    if ($startedServer) {
        Stop-Process -Id $startedServer.Id -Force
    }
}
