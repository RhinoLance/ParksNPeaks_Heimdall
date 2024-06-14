import { environment } from "environment";
import { VKFFSiteRef } from "./Types";



using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

public class VKFFSiteGenerator
{
	private readonly string _url = Environment.GetEnvironmentVariable("wwffDirectoryUrl");

	public async Task<List<VKFFSiteRef>> DownloadSites()
	{
		var html = await RetrieveSiteList();
		var list = ExtractSiteData(html);

		return list;
	}

	private async Task<string> RetrieveSiteList()
	{
		using (var client = new HttpClient())
		{
			var formData = new MultipartFormDataContent();
			formData.Add(new StringContent("VKFF"), "progName");
			formData.Add(new StringContent("Select"), "dxccName");
			formData.Add(new StringContent("n/a"), "refID");

			var response = await client.PostAsync(_url, formData);
			var html = await response.Content.ReadAsStringAsync();

			return html;
		}
	}

	private List<VKFFSiteRef> ExtractSiteData(string html)
	{
		var siteRegex = new Regex(@"<td><input name=""refID"" type=""submit"" value=""(VKFF-\d{4})""><\/td>\s*<td>(.*?)<\/td>\s*<td>(.*?)<\/td>", RegexOptions.Multiline);
		var matches = siteRegex.Matches(html);

		var sites = new List<VKFFSiteRef>();

		foreach (Match match in matches)
		{
			sites.Add(new VKFFSiteRef
			{
				Name = match.Groups[2].Value,
				VKFFId = match.Groups[1].Value
			});
		}

		var active = sites.FindAll(s => !s.Name.Contains("DELETED AREA"));

		return active;
	}
}

public class VKFFSiteRef
{
	public string Name { get; set; }
	public string VKFFId { get; set; }
}